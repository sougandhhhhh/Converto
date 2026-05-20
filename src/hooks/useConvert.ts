import { useState, useEffect } from "react";

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
    setStatus("uploading");
    setError(null);
    setProgress(20);
    setDownloadUrl(null);

    try {
      // Transition to converting state right before making the request
      setStatus("converting");
      setProgress(60);

      const formData = new FormData();
      formData.append("file", file);
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
