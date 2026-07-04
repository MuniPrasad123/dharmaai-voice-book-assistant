/**
 * lib/pdf-extract.ts
 * Extracts plain text from a PDF buffer using pdfjs-dist directly.
 * 
 * IMPORTANT: pdfjs-dist is listed in next.config.ts serverExternalPackages
 * so Node.js loads it natively (not bundled by Turbopack), which lets
 * its internal worker resolution work correctly.
 */

/**
 * Extracts all text content from a PDF file buffer.
 * Iterates through every page and concatenates all text items.
 */
export async function extractTextFromPDF(data: Uint8Array): Promise<string> {
  // Dynamic import so this only runs at request time (server-side)
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Load the PDF document from raw bytes
  const doc = await pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // Each item has a .str property containing the text
    const strings = (content.items as any[])
      .filter((item) => "str" in item)
      .map((item) => item.str);
    pageTexts.push(strings.join(" "));
  }

  doc.destroy();
  return pageTexts.join("\n");
}
