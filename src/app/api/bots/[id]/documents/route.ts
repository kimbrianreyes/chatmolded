import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromBuffer, detectFileType } from "@/lib/documents/parser";
import { chunkText } from "@/lib/documents/chunker";

// In-memory rate limiting map (User ID -> timestamps array)
const uploadRateLimitMap = new Map<string, number[]>();
const MAX_UPLOADS_PER_MINUTE = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = uploadRateLimitMap.get(userId) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_UPLOADS_PER_MINUTE) {
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  uploadRateLimitMap.set(userId, validTimestamps);
  return { allowed: true, remaining: MAX_UPLOADS_PER_MINUTE - validTimestamps.length };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: botId } = await params;
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify bot ownership
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .select("id, name")
      .eq("id", botId)
      .eq("user_id", user.id)
      .single();

    if (botError || !bot) {
      return NextResponse.json({ error: "Bot not found or unauthorized" }, { status: 404 });
    }

    // 3. Enforce Rate Limiting
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Upload rate limit exceeded. Max 5 document uploads per minute." },
        { status: 429 }
      );
    }

    // 4. Parse Form Data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 5. Enforce File Size Limit (5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds maximum allowed size of 5MB." },
        { status: 400 }
      );
    }

    // 6. Validate File Extension
    const fileType = detectFileType(file.name);
    if (!fileType) {
      return NextResponse.json(
        { error: "Unsupported file format. Supported formats: .pdf, .docx, .txt, .md" },
        { status: 400 }
      );
    }

    // 7. Extract Plain Text from Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extractedText = await extractTextFromBuffer(buffer, fileType);

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "No readable text could be extracted from this document." },
        { status: 400 }
      );
    }

    // 8. Chunk the Document into Semantic Segments
    const chunks = chunkText(extractedText, 800, 100);

    // 9. Save Document Record in Database
    const { data: docRecord, error: docError } = await (supabase.from("documents") as any)
      .insert({
        bot_id: botId,
        file_name: file.name,
        file_type: fileType,
        file_size_bytes: file.size,
        status: "indexed",
        chunk_count: chunks.length,
      })
      .select()
      .single();

    if (docError) {
      throw new Error(docError.message);
    }

    // 10. Bulk Insert Chunks into document_chunks
    const chunkRows = chunks.map((chunk) => ({
      bot_id: botId,
      document_id: docRecord.id,
      content: chunk.content,
      token_count: chunk.tokenCount,
      chunk_index: chunk.chunkIndex,
    }));

    const { error: chunkError } = await (supabase.from("document_chunks") as any).insert(
      chunkRows
    );

    if (chunkError) {
      throw new Error(chunkError.message);
    }

    return NextResponse.json({
      success: true,
      document: docRecord,
      chunksCreated: chunks.length,
      remainingUploads: rateCheck.remaining,
    });
  } catch (error: any) {
    console.error("Document ingestion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process and ingest document" },
      { status: 500 }
    );
  }
}
