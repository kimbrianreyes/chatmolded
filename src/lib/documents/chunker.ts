/**
 * Semantic Text Chunking Engine for ChatMolded RAG
 * Splits large documents into overlapping chunks to preserve context across boundaries.
 */

export interface DocumentChunkResult {
  content: string;
  chunkIndex: number;
  tokenCount: number;
}

export function chunkText(
  text: string,
  chunkSize: number = 800,
  chunkOverlap: number = 100
): DocumentChunkResult[] {
  const clean = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!clean) return [];

  // If text is smaller than chunkSize, return single chunk
  if (clean.length <= chunkSize) {
    return [
      {
        content: clean,
        chunkIndex: 0,
        tokenCount: Math.ceil(clean.length / 4),
      },
    ];
  }

  const chunks: DocumentChunkResult[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < clean.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex >= clean.length) {
      const chunkContent = clean.slice(startIndex).trim();
      if (chunkContent.length > 0) {
        chunks.push({
          content: chunkContent,
          chunkIndex,
          tokenCount: Math.ceil(chunkContent.length / 4),
        });
      }
      break;
    }

    // Try to find natural breaking point: double newline -> single newline -> period -> space
    let breakPoint = -1;

    // Search within the last 150 characters of the window for a clean break
    const searchWindow = clean.slice(Math.max(startIndex, endIndex - 150), endIndex);
    
    const doubleNewlineIdx = searchWindow.lastIndexOf("\n\n");
    const singleNewlineIdx = searchWindow.lastIndexOf("\n");
    const periodIdx = searchWindow.lastIndexOf(". ");
    const spaceIdx = searchWindow.lastIndexOf(" ");

    if (doubleNewlineIdx !== -1) {
      breakPoint = endIndex - 150 + doubleNewlineIdx + 2;
    } else if (singleNewlineIdx !== -1) {
      breakPoint = endIndex - 150 + singleNewlineIdx + 1;
    } else if (periodIdx !== -1) {
      breakPoint = endIndex - 150 + periodIdx + 2;
    } else if (spaceIdx !== -1) {
      breakPoint = endIndex - 150 + spaceIdx + 1;
    } else {
      breakPoint = endIndex;
    }

    const chunkContent = clean.slice(startIndex, breakPoint).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        content: chunkContent,
        chunkIndex,
        tokenCount: Math.ceil(chunkContent.length / 4),
      });
      chunkIndex++;
    }

    // Advance startIndex with overlap
    startIndex = Math.max(startIndex + 1, breakPoint - chunkOverlap);
  }

  return chunks;
}
