import { PDFDocument, rgb } from "pdf-lib";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".html": "text/html",
  ".csv": "text/csv",
  ".json": "application/json",
  ".xml": "application/xml",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".avif"];

async function decodeImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const name = file.name.toLowerCase();
  const isHeic = name.endsWith(".heic");

  if (isHeic) {
    return decodeHeicToCanvas(await file.arrayBuffer());
  }

  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  img.close();
  return canvas;
}

async function decodeHeicToCanvas(buffer: ArrayBuffer): Promise<HTMLCanvasElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const libheifModule: any = await import("libheif-js/wasm-bundle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const libheif: any = libheifModule.default || libheifModule;
  const decoder = new libheif.HeifDecoder();
  const images = decoder.decode(new Uint8Array(buffer));
  if (!images || images.length === 0) {
    throw new Error("No images found in HEIC file");
  }
  const image = images[0];
  const width = image.get_width();
  const height = image.get_height();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);

  await new Promise<void>((resolve, reject) => {
    image.display(
      { data: imageData.data as any, width, height },
      (displayData: unknown) => {
        if (!displayData) {
          reject(new Error("HEIF processing error"));
          return;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve();
      }
    );
  });

  image.free();
  return canvas;
}

async function canvasToImageBlob(canvas: HTMLCanvasElement, ext: string): Promise<Blob> {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("JPEG encode failed")), "image/jpeg", 0.92);
      });
    case ".png":
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("PNG encode failed")), "image/png");
      });
    case ".webp":
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("WEBP encode failed")), "image/webp", 0.92);
      });
    case ".gif":
      return encodeGif(canvas);
    case ".avif":
      return encodeAvif(canvas);
    default:
      throw new Error(`Unsupported image format: ${ext}`);
  }
}

async function encodeGif(canvas: HTMLCanvasElement): Promise<Blob> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gifModule: any = await import("gif.js");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GIFEncoder: any = (gifModule.default || gifModule).GIFEncoder;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = new Uint8Array(canvas.width * canvas.height * 3);
  for (let i = 0; i < canvas.width * canvas.height; i++) {
    pixels[i * 3] = imageData.data[i * 4];
    pixels[i * 3 + 1] = imageData.data[i * 4 + 1];
    pixels[i * 3 + 2] = imageData.data[i * 4 + 2];
  }

  const encoder = new GIFEncoder(canvas.width, canvas.height);
  encoder.setRepeat(-1);
  encoder.setDelay(100);
  encoder.setQuality(10);
  encoder.addFrame(pixels);
  encoder.finish();

  const stream = encoder.stream();
  const { pages, cursor } = stream;
  const result = new Uint8Array(cursor);
  let offset = 0;
  for (const page of pages) {
    const len = Math.min(page.length, cursor - offset);
    if (len <= 0) break;
    result.set(page.subarray(0, len), offset);
    offset += len;
  }
  return new Blob([result], { type: "image/gif" });
}

async function encodeAvif(canvas: HTMLCanvasElement): Promise<Blob> {
  const pngBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png")
  );
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

  const avif = await import("avif-wasm");
  await avif.init();
  const options = new avif.ConversionOptions(60, 80, avif.Subsampling.YUV444, false);
  const avifData = await avif.encode(pngBytes, options, () => {});
  const fixed = new Uint8Array(avifData.byteLength);
  fixed.set(avifData);
  return new Blob([fixed], { type: "image/avif" });
}

async function imageToImage(file: File, targetExt: string): Promise<Blob> {
  const canvas = await decodeImageToCanvas(file);
  return canvasToImageBlob(canvas, targetExt);
}

async function imageToPdf(file: File): Promise<Blob> {
  const canvas = await decodeImageToCanvas(file);
  const pngBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png")
  );
  const pngBytes = await pngBlob.arrayBuffer();

  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
  page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });

  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

async function txtToPdf(text: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { height } = page.getSize();

  const fontSize = 11;
  const lines = text.split("\n");
  let y = height - 50;

  for (const line of lines) {
    if (y < 40) {
      pdfDoc.addPage([612, 792]);
      y = height - 50;
    }
    page.drawText(line || " ", { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
    y -= fontSize + 4;
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

async function htmlToPdf(html: string): Promise<Blob> {
  const stripped = html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ");
  return txtToPdf(stripped);
}

async function txtToFormat(text: string, targetExt: string): Promise<Blob> {
  let content: string;
  const mime = EXT_TO_MIME[targetExt] || "text/plain";

  switch (targetExt) {
    case ".html": {
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const paragraphs = escaped
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `<p>${l}</p>`)
        .join("\n");
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted</title></head><body>${paragraphs}</body></html>`;
      break;
    }
    case ".csv": {
      content = text
        .split("\n")
        .map((l) => `"${l.replace(/"/g, '""')}"`)
        .join("\n");
      break;
    }
    case ".json":
      content = JSON.stringify(
        text.split("\n").filter((l) => l.trim()).map((l) => ({ line: l })),
        null, 2
      );
      break;
    case ".xml":
      content = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${text
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `  <line>${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</line>`)
        .join("\n")}\n</root>`;
      break;
    case ".txt":
    default:
      content = text;
      break;
  }

  return new Blob([content], { type: mime });
}

async function docxToFormat(file: File, targetExt: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  let content: string;

  if (targetExt === ".html") {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    content = result.value;
  } else {
    const result = await mammoth.extractRawText({ arrayBuffer });
    content = result.value;
  }

  const mime = EXT_TO_MIME[targetExt] || "text/plain";
  return new Blob([content], { type: mime });
}

async function xlsxToFormat(file: File, targetExt: string): Promise<Blob> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  let content: string;
  const mime = EXT_TO_MIME[targetExt] || "text/plain";

  switch (targetExt) {
    case ".csv":
      content = XLSX.utils.sheet_to_csv(sheet);
      break;
    case ".json": {
      const rows = XLSX.utils.sheet_to_json(sheet);
      content = JSON.stringify(rows, null, 2);
      break;
    }
    case ".html":
      content = XLSX.utils.sheet_to_html(sheet);
      break;
    case ".txt":
      content = XLSX.utils.sheet_to_csv(sheet, { FS: "\t" });
      break;
    case ".xml": {
      const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];
      content = `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${rows
        .map(
          (r) =>
            `  <row>\n${Object.entries(r)
              .map(([k, v]) => `    <${k}>${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</${k}>`)
              .join("\n")}\n  </row>`
        )
        .join("\n")}\n</rows>`;
      break;
    }
    default:
      content = XLSX.utils.sheet_to_csv(sheet);
  }

  return new Blob([content], { type: mime });
}

async function textToText(file: File, fromExt: string, toExt: string): Promise<Blob> {
  const text = await file.text();
  let parsed: unknown[] | Record<string, unknown> | string;

  switch (fromExt) {
    case ".json":
      parsed = JSON.parse(text);
      break;
    case ".csv": {
      const lines = text.split("\n").filter(Boolean);
      const headers = lines[0]?.split(",").map((h) => h.trim().replace(/^"|"$/g, "")) || [];
      parsed = lines.slice(1).map((line) => {
        const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => (row[h] = vals[i] || ""));
        return row;
      });
      break;
    }
    case ".xml": {
      const matches = text.match(/<row>([\s\S]*?)<\/row>/g) || [];
      parsed = matches.map((row) => {
        const obj: Record<string, string> = {};
        const fields = row.match(/<(\w+)>([^<]*)<\/\1>/g) || [];
        fields.forEach((f) => {
          const m = f.match(/<(\w+)>([^<]*)<\/\1>/);
          if (m) obj[m[1]] = m[2];
        });
        return obj;
      });
      break;
    }
    default:
      parsed = text;
  }

  let result: string;
  const mime = EXT_TO_MIME[toExt] || "text/plain";

  switch (toExt) {
    case ".json":
      result = typeof parsed === "string" ? JSON.stringify({ content: parsed }) : JSON.stringify(parsed, null, 2);
      break;
    case ".csv": {
      const arr = Array.isArray(parsed) ? parsed : [{ content: String(parsed) }];
      const keys = arr.length > 0 ? Object.keys(arr[0] as Record<string, unknown>) : [];
      result = [keys.join(","), ...arr.map((r) => keys.map((k) => `"${String((r as Record<string, unknown>)[k] || "").replace(/"/g, '""')}"`).join(","))].join("\n");
      break;
    }
    case ".xml": {
      const arr = Array.isArray(parsed) ? parsed : [{ content: String(parsed) }];
      result = `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${arr
        .map(
          (r) =>
            `  <row>\n${Object.entries(r as Record<string, unknown>)
              .map(([k, v]) => `    <${k}>${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</${k}>`)
              .join("\n")}\n  </row>`
        )
        .join("\n")}\n</rows>`;
      break;
    }
    case ".html": {
      const arr = Array.isArray(parsed) ? parsed : [{ line: String(parsed) }];
      const items = arr
        .map((r) => `<li>${Object.values(r as Record<string, unknown>).join(" - ")}</li>`)
        .join("\n");
      result = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted</title></head><body><ul>${items}</ul></body></html>`;
      break;
    }
    default:
      result = typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2);
  }

  return new Blob([result], { type: mime });
}

async function mdToHtml(md: string): Promise<string> {
  const { marked } = await import("marked");
  return marked.parse(md) as Promise<string>;
}

async function mdToTxt(md: string): Promise<string> {
  const html = await mdToHtml(md);
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
}

async function mdToFormat(file: File, targetExt: string): Promise<Blob> {
  const md = await file.text();
  const mime = EXT_TO_MIME[targetExt] || "text/plain";

  switch (targetExt) {
    case ".html": {
      const html = await mdToHtml(md);
      return new Blob([html], { type: mime });
    }
    case ".txt": {
      const txt = await mdToTxt(md);
      return new Blob([txt], { type: mime });
    }
    case ".pdf": {
      const html = await mdToHtml(md);
      return htmlToPdf(html);
    }
    default:
      throw new Error(`Unsupported target format for MD: ${targetExt}`);
  }
}

export interface ClientConvertResult {
  blob: Blob;
  fileName: string;
}

export async function clientConvert(file: File, from: string, to: string): Promise<ClientConvertResult> {
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  if (IMAGE_EXTS.includes(f) && IMAGE_EXTS.includes(t)) {
    const blob = await imageToImage(file, t);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + t };
  }

  if (IMAGE_EXTS.includes(f) && t === ".pdf") {
    const blob = await imageToPdf(file);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + ".pdf" };
  }

  if (f === ".txt") {
    const text = await file.text();
    if (t === ".pdf") {
      const blob = await txtToPdf(text);
      return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + ".pdf" };
    }
    const blob = await txtToFormat(text, t);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + t };
  }

  if (f === ".html" && t === ".pdf") {
    const text = await file.text();
    const blob = await htmlToPdf(text);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + ".pdf" };
  }

  if (f === ".docx" && [".txt", ".html"].includes(t)) {
    const blob = await docxToFormat(file, t);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + t };
  }

  if (f === ".xlsx" && [".csv", ".json", ".xml", ".txt", ".html"].includes(t)) {
    const blob = await xlsxToFormat(file, t);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + t };
  }

  if ([".csv", ".json", ".xml"].includes(f) && [".csv", ".json", ".xml", ".html", ".txt"].includes(t)) {
    const blob = await textToText(file, f, t);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + t };
  }

  if (f === ".md" && [".html", ".pdf", ".txt"].includes(t)) {
    const blob = await mdToFormat(file, t);
    return { blob, fileName: file.name.replace(/\.[^/.]+$/, "") + t };
  }

  throw new Error(`Unsupported client-side conversion: ${f} → ${t}`);
}
