import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import sharp from "sharp";
import PDFDocument from "pdfkit";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const dynamic = "force-dynamic";

const GOTENBERG_URL = process.env.GOTENBERG_URL || "http://localhost:3020";

/**
 * Handles the conversion API requests
 * @param req The NextRequest containing multipart form data
 * @returns A NextResponse with the PDF buffer or a JSON with R2 presigned URL
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const format = formData.get("format") as string;

    if (!file || !format) {
      return NextResponse.json({ error: "Conversion failed", details: "Missing file or format" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "Conversion failed", details: "File too large (max 50MB)" }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let pdfBuffer: Buffer;

    if (format === ".jpg" || format === ".jpeg" || format === ".png") {
      // Use sharp to read image metadata and pdfkit to create PDF
      const metadata = await sharp(buffer).metadata();
      const width = metadata.width || 595.28;
      const height = metadata.height || 841.89;

      const doc = new PDFDocument({ size: [width, height], margin: 0 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      
      const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));
      });

      doc.image(buffer, 0, 0, { width, height });
      doc.end();

      pdfBuffer = await pdfBufferPromise;
    } else {
      let endpoint = "";
      const formDataToSend = new FormData();

      if ([".docx", ".doc", ".odt", ".txt"].includes(format)) {
        endpoint = "/forms/libreoffice/convert";
        formDataToSend.append("files", new Blob([buffer]), file.name);
      } else if ([".xlsx", ".xls", ".csv"].includes(format)) {
        endpoint = "/forms/libreoffice/convert";
        formDataToSend.append("files", new Blob([buffer]), file.name);
      } else if ([".pptx", ".ppt"].includes(format)) {
        endpoint = "/forms/libreoffice/convert";
        formDataToSend.append("files", new Blob([buffer]), file.name);
      } else if (format === ".html") {
        endpoint = "/forms/chromium/convert/html";
        formDataToSend.append("files", new Blob([buffer]), "index.html");
      } else if (format === ".md") {
        const mdText = new TextDecoder().decode(buffer);
        const htmlContent = await marked.parse(mdText);
        endpoint = "/forms/chromium/convert/html";
        formDataToSend.append("files", new Blob([htmlContent]), "index.html");
      } else {
        return NextResponse.json({ error: "Conversion failed", details: "Unsupported format" }, { status: 400 });
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      try {
        const response = await fetch(`${GOTENBERG_URL}${endpoint}`, {
          method: "POST",
          body: formDataToSend,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const text = await response.text();
          return NextResponse.json({ error: "Conversion failed", details: text }, { status: 500 });
        }

        const resArrayBuffer = await response.arrayBuffer();
        pdfBuffer = Buffer.from(resArrayBuffer);
      } catch (err) {
        clearTimeout(timeout);
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: "Conversion failed", details: errorMessage }, { status: 500 });
      }
    }

    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY && process.env.R2_SECRET_KEY && process.env.R2_BUCKET) {
      const s3Client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY,
          secretAccessKey: process.env.R2_SECRET_KEY,
        },
      });

      const uuid = crypto.randomUUID();
      const key = `conversions/${uuid}-${file.name}.pdf`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: pdfBuffer,
          ContentType: "application/pdf",
        })
      );

      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

      return NextResponse.json({ url: signedUrl });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted.pdf"`,
      },
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Conversion failed", details: errorMessage }, { status: 500 });
  }
}
