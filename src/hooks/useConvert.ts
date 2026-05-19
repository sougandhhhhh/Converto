import { useState } from "react";

export type ConvertStatus = "idle" | "uploading" | "converting" | "done" | "error";

export interface UseConvertResult {
  convert: (file: File, format: string) => Promise<void>;
  status: ConvertStatus;
  error: string | null;
  progress: number;
}

/**
 * A React hook to manage file conversions via the `/api/convert` endpoint.
 * @returns {UseConvertResult} An object containing the convert function and state indicators
 */
export function useConvert(): UseConvertResult {
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  /**
   * Converts a file to PDF and automatically downloads it
   * @param {File} file The file to convert
   * @param {string} format The format of the source file (e.g., '.docx')
   */
  const convert = async (file: File, format: string) => {
    setStatus("uploading");
    setError(null);
    setProgress(20);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      // Transition to converting state right before making the fetch request
      setStatus("converting");
      setProgress(60);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMessage = "Unknown conversion error";
        try {
          const errData = await response.json();
          errMessage = errData.details || errData.error || errMessage;
        } catch {
          errMessage = await response.text() || errMessage;
        }
        throw new Error(errMessage);
      }

      // Check if response is JSON (R2 signed URL) or PDF stream
      const contentType = response.headers.get("content-type");
      
      let downloadUrl = "";

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        downloadUrl = data.url;
      } else {
        const blob = await response.blob();
        downloadUrl = URL.createObjectURL(blob);
        
        // Cleanup after 60 seconds
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 60000);
      }

      // Trigger automatic download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus("done");
      setProgress(100);
    } catch (err) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An unexpected error occurred during conversion.");
      setProgress(0);
    }
  };

  return { convert, status, error, progress };
}
