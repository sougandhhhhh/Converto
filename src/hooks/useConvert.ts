import { useState, useEffect } from "react";
const FALLBACK_VERCEL_LIMIT_MB = 4.5;
const DIRECT_BACKEND_DEFAULT_LIMIT_MB = 50;
const POLL_INTERVAL_MS = 1200;
const DIRECT_CONVERSION_TIMEOUT_MS = 8 * 60 * 1000;

function getClientUploadLimitMb(): number {
  const configured = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || "");
  if (Number.isFinite(configured) && configured > 0) return configured;
  const hasDirectBackend = Boolean(process.env.NEXT_PUBLIC_CONVERTO_BACKEND_URL);
  return hasDirectBackend ? DIRECT_BACKEND_DEFAULT_LIMIT_MB : FALLBACK_VERCEL_LIMIT_MB;
}

export type ConvertStatus = "idle" | "uploading" | "converting" | "done" | "error";

export interface UseConvertResult {
  convert: (file: File, fromFormat: string, toFormat: string) => Promise<void>;
  status: ConvertStatus;
  error: string | null;
  progress: number;
  downloadUrl: string | null;
  downloadName: string | null;
}

type BackendConvertResponse = { task_id?: string };
type BackendStatusResponse = { status?: string; error?: string };

function extractFilenameFromDisposition(disposition: string): string | null {
  if (!disposition) return null;
  const utf8Match = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      return utf8Match[1].trim().replace(/^["']|["']$/g, "");
    }
  }
  const quotedMatch = disposition.match(/filename\s*=\s*"([^"]+)"/i);
  if (quotedMatch?.[1]) return quotedMatch[1].trim();
  const plainMatch = disposition.match(/filename\s*=\s*([^;]+)/i);
  if (plainMatch?.[1]) return plainMatch[1].trim().replace(/^["']|["']$/g, "");
  return null;
}

/**
 * A React hook to manage file conversions via the `/api/convert` endpoint.
 * @returns {UseConvertResult} An object containing the convert function and state indicators
 */
export function useConvert(): UseConvertResult {
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);

  // Clean up Object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (downloadUrl && downloadUrl.startsWith("blob:")) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  /**
   * Converts a file
   * @param {File} file The file to convert
   * @param {string} fromFormat The format of the source file (e.g., '.docx')
   * @param {string} toFormat The format of the target file (e.g., '.pdf')
   */
  const convert = async (file: File, fromFormat: string, toFormat: string) => {
    const maxUploadMb = getClientUploadLimitMb();
    const maxUploadBytes = Math.floor(maxUploadMb * 1024 * 1024);
    if (file.size > maxUploadBytes) {
      setStatus("error");
      setError(`File too large. Max ${maxUploadMb} MB per file.`);
      setProgress(0);
      setDownloadUrl(null);
      setDownloadName(null);
      return;
    }

    setStatus("uploading");
    setError(null);
    setProgress(12);
    setDownloadUrl(null);
    setDownloadName(null);

    try {
      const backendPublicBase = (process.env.NEXT_PUBLIC_CONVERTO_BACKEND_URL || "").replace(/\/$/, "");
      // Transition to converting state right before making the request
      setStatus("converting");
      setProgress(28);

      let fileId: string | null = null;

      // Direct upload from browser to backend avoids Vercel payload limits.
      if (backendPublicBase) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        const uploadRes = await fetch(`${backendPublicBase}/api/upload`, {
          method: "POST",
          body: uploadForm,
        });
        if (!uploadRes.ok) {
          const uploadText = await uploadRes.text();
          throw new Error(uploadText || "Direct upload to backend failed.");
        }
        const uploadData = await uploadRes.json() as { file_id?: string };
        if (!uploadData.file_id) {
          throw new Error("Backend did not return file id after upload.");
        }
        fileId = uploadData.file_id;
        setProgress(40);
      }

      // When direct backend URL is configured, keep the entire conversion flow
      // off Vercel functions to avoid request body and function duration limits.
      if (backendPublicBase && fileId) {
        const targetExt = toFormat.startsWith(".") ? toFormat : `.${toFormat}`;
        const convertUrl = new URL(`${backendPublicBase}/api/convert`);
        convertUrl.searchParams.set("file_id", fileId);
        convertUrl.searchParams.set("target_ext", targetExt);

        const convertRes = await fetch(convertUrl.toString(), {
          method: "POST",
        });
        if (!convertRes.ok) {
          const t = await convertRes.text();
          throw new Error(t || "Failed to enqueue backend conversion.");
        }
        const convertData = (await convertRes.json()) as BackendConvertResponse;
        if (!convertData.task_id) {
          throw new Error("Backend did not return task id.");
        }

        const started = Date.now();
        setProgress(46);
        while (Date.now() - started < DIRECT_CONVERSION_TIMEOUT_MS) {
          const statusRes = await fetch(`${backendPublicBase}/api/status/${convertData.task_id}`, {
            method: "GET",
          });
          if (!statusRes.ok) {
            const t = await statusRes.text();
            throw new Error(t || "Failed to read backend conversion status.");
          }
          const statusData = (await statusRes.json()) as BackendStatusResponse;
          const state = (statusData.status || "").toUpperCase();

          if (state === "SUCCESS") {
            setProgress(92);
            break;
          }
          if (state === "FAILURE") {
            throw new Error(statusData.error || "Backend conversion failed.");
          }

          const elapsedRatio = Math.min(1, (Date.now() - started) / DIRECT_CONVERSION_TIMEOUT_MS);
          // Keep visible momentum while backend works.
          setProgress(46 + Math.floor(elapsedRatio * 44));
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        }

        if (Date.now() - started >= DIRECT_CONVERSION_TIMEOUT_MS) {
          throw new Error("Conversion timed out. Please try again.");
        }

        const downloadRes = await fetch(`${backendPublicBase}/api/download/${convertData.task_id}`, {
          method: "GET",
        });
        if (!downloadRes.ok) {
          const t = await downloadRes.text();
          throw new Error(t || "Converted file was not available for download.");
        }

        setProgress(96);
        const blob = await downloadRes.blob();
        const url = URL.createObjectURL(blob);
        const disposition = downloadRes.headers.get("content-disposition") || "";
        const headerName = extractFilenameFromDisposition(disposition);
        const guessedName =
          blob.type.includes("zip")
            ? `${file.name.replace(/\.[^/.]+$/, "")}.zip`
            : `${file.name.replace(/\.[^/.]+$/, "")}${targetExt}`;
        const resolvedName = headerName || guessedName;
        setDownloadUrl(url);
        setDownloadName(resolvedName);
        setStatus("done");
        setProgress(100);
        return;
      }

      const formData = new FormData();
      if (fileId) {
        formData.append("file_id", fileId);
        formData.append("file_name", file.name);
      } else {
        formData.append("file", file);
      }
      formData.append("format", fromFormat);
      formData.append("to", toFormat);

      setProgress(46);
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMessage = "Unknown conversion error";
        const text = await response.text();
        try {
          const errData = JSON.parse(text);
          errMessage = errData.details || errData.error || errMessage;
        } catch {
          errMessage = text || errMessage;
        }
        throw new Error(errMessage);
      }

      setProgress(92);
      // Check if response is JSON (R2 signed URL) or PDF stream
      const contentType = response.headers.get("content-type");
      
      let url = "";

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }

        // Support both legacy signed URL shape and raw JSON conversion outputs.
        const maybeUrl = parsed && typeof parsed === "object" && "url" in parsed
          ? (parsed as { url?: string }).url
          : undefined;

        if (maybeUrl && typeof maybeUrl === "string") {
          url = maybeUrl;
        } else {
          const jsonBlob = new Blob([text], { type: "application/json" });
          url = URL.createObjectURL(jsonBlob);
        }
      } else {
        setProgress(96);
        const blob = await response.blob();
        url = URL.createObjectURL(blob);
      }

      const routeDisposition = response.headers.get("content-disposition") || "";
      setDownloadName(extractFilenameFromDisposition(routeDisposition) || `${file.name.replace(/\.[^/.]+$/, "")}${toFormat}`);
      setDownloadUrl(url);
      setStatus("done");
      setProgress(100);
    } catch (err) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An unexpected error occurred during conversion.");
      setProgress(0);
    }
  };

  return { convert, status, error, progress, downloadUrl, downloadName };
}
