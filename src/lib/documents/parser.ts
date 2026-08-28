import mammoth from "mammoth";

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
      const pdfParseModule: any = await import("pdf-parse");
      const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default || pdfParseModule;
      const data = await pdfParse(buffer);
      return data.text;
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
