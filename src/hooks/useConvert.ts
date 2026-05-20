import { useState, useEffect } from "react";
const MAX_UPLOAD_MB = 4.5;
const MAX_UPLOAD_BYTES = Math.floor(MAX_UPLOAD_MB * 1024 * 1024);

export type ConvertStatus = "idle" | "uploading" | "converting" | "done" | "error";

export interface UseConvertResult {
  convert: (file: File, fromFormat: string, toFormat: string) => Promise<void>;
  status: ConvertStatus;
  error: string | null;
  progress: number;
  downloadUrl: string | null;
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
    if (file.size > MAX_UPLOAD_BYTES) {
      setStatus("error");
      setError(`File too large. Max ${MAX_UPLOAD_MB} MB per file.`);
      setProgress(0);
      setDownloadUrl(null);
      return;
    }

    setStatus("uploading");
    setError(null);
    setProgress(20);
    setDownloadUrl(null);

    try {
      const backendPublicBase = (process.env.NEXT_PUBLIC_CONVERTO_BACKEND_URL || "").replace(/\/$/, "");
      // Transition to converting state right before making the request
      setStatus("converting");
      setProgress(60);

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

      // Check if response is JSON (R2 signed URL) or PDF stream
      const contentType = response.headers.get("content-type");
      
      let url = "";

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        url = data.url;
      } else {
        const blob = await response.blob();
        url = URL.createObjectURL(blob);
      }

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

  return { convert, status, error, progress, downloadUrl };
}
