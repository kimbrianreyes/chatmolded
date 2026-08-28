import mammoth from "mammoth";
import { extractText } from "unpdf";

export type SupportedExtension = "pdf" | "docx" | "txt" | "md";

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: SupportedExtension
): Promise<string> {
  switch (fileType) {
    case "txt":
    case "md": {
      return buffer.toString("utf-8");
    }

    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    case "pdf": {
      try {
        const uint8Data = new Uint8Array(buffer);
        const { text } = await extractText(uint8Data, { mergePages: true });
        return text || "";
      } catch (err: any) {
        console.error("PDF Parsing Error with unpdf:", err);
        throw new Error(`Failed to extract text from PDF: ${err.message || "Unknown error"}`);
      }
    }

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

export function detectFileType(fileName: string): SupportedExtension | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || ext === "docx" || ext === "txt" || ext === "md") {
    return ext;
  }
  return null;
}
