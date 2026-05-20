import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_API_BASE = (
  process.env.CONVERTO_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

const OUTPUT_CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".txt": "text/plain",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".html": "text/html",
  ".csv": "text/csv",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".gif": "image/gif",
  ".zip": "application/zip",
  ".heic": "image/heic",
  ".json": "application/json",
  ".xml": "application/xml",
  ".avif": "image/avif",
};

const POLL_INTERVAL_MS = 1200;
const CONVERSION_TIMEOUT_MS = 180000;

type BackendStatusResponse = {
  status?: string;
  output_path?: string;
  error?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeExt(input: string): string {
  const ext = input.trim().toLowerCase();
  return ext.startsWith(".") ? ext : `.${ext}`;
}

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function waitForConversion(taskId: string): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < CONVERSION_TIMEOUT_MS) {
    const statusResponse = await fetch(`${BACKEND_API_BASE}/api/status/${taskId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!statusResponse.ok) {
      const body = await parseJsonSafe(statusResponse);
      throw new Error(body?.detail || "Failed to read conversion status from backend.");
    }

    const payload = (await statusResponse.json()) as BackendStatusResponse;
    const state = (payload.status || "").toUpperCase();

    if (state === "SUCCESS") return;
    if (state === "FAILURE") {
      throw new Error(payload.error || "Backend conversion failed.");
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error("Conversion timed out. Please try again.");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const format = formData.get("format");
    const to = formData.get("to");

    if (!(file instanceof File) || typeof format !== "string" || typeof to !== "string") {
      return NextResponse.json(
        { error: "Conversion failed", details: "Missing or invalid file/format parameters." },
        { status: 400 },
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Conversion failed", details: "File too large (max 50MB)." },
        { status: 413 },
      );
    }

    const targetExt = normalizeExt(to);

    const uploadForm = new FormData();
    uploadForm.append("file", file, file.name);

    const uploadResponse = await fetch(`${BACKEND_API_BASE}/api/upload`, {
      method: "POST",
      body: uploadForm,
      cache: "no-store",
    });

    if (!uploadResponse.ok) {
      const body = await parseJsonSafe(uploadResponse);
      return NextResponse.json(
        {
          error: "Conversion failed",
          details: body?.detail || "Upload to conversion backend failed.",
        },
        { status: 502 },
      );
    }

    const uploadData = (await uploadResponse.json()) as { file_id?: string };
    if (!uploadData.file_id) {
      return NextResponse.json(
        { error: "Conversion failed", details: "Backend did not return a file identifier." },
        { status: 502 },
      );
    }

    const convertUrl = new URL(`${BACKEND_API_BASE}/api/convert`);
    convertUrl.searchParams.set("file_id", uploadData.file_id);
    convertUrl.searchParams.set("target_ext", targetExt);

    const convertResponse = await fetch(convertUrl.toString(), {
      method: "POST",
      cache: "no-store",
    });

    if (!convertResponse.ok) {
      const body = await parseJsonSafe(convertResponse);
      return NextResponse.json(
        { error: "Conversion failed", details: body?.detail || "Failed to enqueue conversion task." },
        { status: 502 },
      );
    }

    const convertData = (await convertResponse.json()) as { task_id?: string };
    if (!convertData.task_id) {
      return NextResponse.json(
        { error: "Conversion failed", details: "Backend did not return a task id." },
        { status: 502 },
      );
    }

    await waitForConversion(convertData.task_id);

    const downloadResponse = await fetch(`${BACKEND_API_BASE}/api/download/${convertData.task_id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!downloadResponse.ok) {
      const body = await parseJsonSafe(downloadResponse);
      return NextResponse.json(
        { error: "Conversion failed", details: body?.detail || "Converted file was not available." },
        { status: 502 },
      );
    }

    const outputBuffer = Buffer.from(await downloadResponse.arrayBuffer());
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const outFileName = `${baseName}${targetExt}`;

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": OUTPUT_CONTENT_TYPES[targetExt] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${outFileName}"`,
      },
    });
  } catch (err) {
    const details = err instanceof Error ? err.message : "Unexpected conversion error.";
    return NextResponse.json({ error: "Conversion failed", details }, { status: 500 });
  }
}
