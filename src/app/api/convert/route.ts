import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

function getBackendApiBase(): string | null {
  const raw =
    process.env.CONVERTO_BACKEND_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:8000";
  const normalized = raw.replace(/\/$/, "");

  // In production (e.g. Vercel), localhost resolves to the serverless function itself.
  // That backend is not present there, so fail early with a clear config error.
  if (
    process.env.NODE_ENV === "production" &&
    /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(normalized)
  ) {
    return null;
  }

  return normalized;
}

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

async function waitForConversion(taskId: string, backendApiBase: string): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < CONVERSION_TIMEOUT_MS) {
    const statusResponse = await fetch(`${backendApiBase}/api/status/${taskId}`, {
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
    const backendApiBase = getBackendApiBase();
    if (!backendApiBase) {
      return NextResponse.json(
        {
          error: "Conversion failed",
          details:
            "Backend URL is not configured for production. Set CONVERTO_BACKEND_URL in Vercel to your public backend URL.",
        },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const fileId = formData.get("file_id");
    const format = formData.get("format");
    const to = formData.get("to");

    const hasFile = file instanceof File;
    const hasFileId = typeof fileId === "string" && fileId.trim().length > 0;
    if ((!hasFile && !hasFileId) || typeof format !== "string" || typeof to !== "string") {
      return NextResponse.json(
        { error: "Conversion failed", details: "Missing or invalid file/file_id/format parameters." },
        { status: 400 },
      );
    }

    if (hasFile && file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Conversion failed", details: "File too large (max 50MB)." },
        { status: 413 },
      );
    }

    const targetExt = normalizeExt(to);
    let resolvedFileId = hasFileId ? fileId.trim() : "";
    let sourceBaseName = "converted";

    if (hasFile) {
      const uploadForm = new FormData();
      uploadForm.append("file", file, file.name);

      const uploadResponse = await fetch(`${backendApiBase}/api/upload`, {
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
      resolvedFileId = uploadData.file_id;
      sourceBaseName = file.name.replace(/\.[^/.]+$/, "");
    } else if (hasFileId) {
      const incomingName = typeof formData.get("file_name") === "string" ? String(formData.get("file_name")) : "";
      sourceBaseName = (incomingName || fileId.trim()).replace(/\.[^/.]+$/, "");
    }

    const convertUrl = new URL(`${backendApiBase}/api/convert`);
    convertUrl.searchParams.set("file_id", resolvedFileId);
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

    await waitForConversion(convertData.task_id, backendApiBase);

    const downloadResponse = await fetch(`${backendApiBase}/api/download/${convertData.task_id}`, {
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
    const outFileName = `${sourceBaseName}${targetExt}`;

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
