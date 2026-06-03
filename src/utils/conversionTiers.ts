export type ConversionMode = "client" | "server";

export interface TierInfo {
  mode: ConversionMode;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".avif"];
const TEXT_EXTS = [".txt", ".html", ".csv", ".json", ".xml"];
export function getConversionMode(from: string, to: string): ConversionMode {
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  // Image ↔ Image (any image format)
  if (IMAGE_EXTS.includes(f) && IMAGE_EXTS.includes(t)) return "client";
  // Image → PDF
  if (IMAGE_EXTS.includes(f) && t === ".pdf") return "client";
  // TXT → any text format, PDF, or DOCX
  if (f === ".txt" && [...TEXT_EXTS, ".pdf", ".docx"].includes(t)) return "client";
  // DOCX → TXT/HTML
  if (f === ".docx" && [".txt", ".html"].includes(t)) return "client";
  // XLSX → CSV/JSON/XML/TXT/HTML
  if (f === ".xlsx" && [".csv", ".json", ".xml", ".txt", ".html"].includes(t)) return "client";
  // CSV/JSON/XML/HTML → other text formats
  if (["csv", ".csv", ".json", ".xml", ".html"].includes(f) && TEXT_EXTS.includes(t)) return "client";
  // HTML → PDF
  if (f === ".html" && t === ".pdf") return "client";
  // MD → HTML, PDF, TXT
  if (f === ".md" && [".html", ".pdf", ".txt"].includes(t)) return "client";

  return "server";
}

export function getTierInfo(from: string, to: string): TierInfo {
  const mode = getConversionMode(from, to);
  if (mode === "client") {
    return {
      mode: "client",
      label: "Processing in your browser",
      description: "This conversion runs entirely in your browser. Your file never leaves your device.",
      pros: [
        "No file size limits — your device memory is the only constraint",
        "100% private — files never uploaded to any server",
        "No internet required after page load",
        "Instant start — no upload wait time",
        "Unlimited batch conversions",
      ],
      cons: [
        "Slower for very large files compared to server",
        "May use significant browser memory",
        "Some complex formatting may differ from server output",
      ],
    };
  }
  return {
    mode: "server",
    label: "Processing on server",
    description: "This conversion is processed on our secure backend servers.",
    pros: [
      "Professional-grade conversion engines (Camelot, LibreOffice, OCRmyPDF)",
      "Best quality for complex layouts and structured documents",
      "Handles large files without browser memory strain",
      "Consistent output across all devices",
    ],
    cons: [
      "Files are uploaded to server (encrypted in transit)",
      "File size limits apply (50 MB per file)",
      "Requires internet connection",
      "Rate limits may apply",
    ],
  };
}
