import { useState, useEffect } from "react";
import { marked } from "marked";

export type ConvertStatus = "idle" | "uploading" | "converting" | "done" | "error";

export interface UseConvertResult {
  convert: (file: File, format: string) => Promise<void>;
  status: ConvertStatus;
  error: string | null;
  progress: number;
  downloadUrl: string | null;
}

/**
 * A React hook to manage file conversions via the `/api/convert` endpoint or direct Gotenberg calls.
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
   * Converts a file to PDF
   * @param {File} file The file to convert
   * @param {string} format The format of the source file (e.g., '.docx')
   */
  const convert = async (file: File, format: string) => {
    setStatus("uploading");
    setError(null);
    setProgress(20);
    setDownloadUrl(null);

    const gotenbergUrl = process.env.NEXT_PUBLIC_GOTENBERG_URL;
    
    // We can do direct browser-to-Gotenberg conversion for documents/spreadsheets/presentations/html/markdown
    // if NEXT_PUBLIC_GOTENBERG_URL is set, to bypass Vercel's 4.5MB payload limit.
    const isDirectConvertible = gotenbergUrl && [
      ".docx", ".doc", ".odt", ".txt",
      ".xlsx", ".xls", ".csv",
      ".pptx", ".ppt",
      ".html", ".md"
    ].includes(format);

    try {
      // Transition to converting state right before making the request
      setStatus("converting");
      setProgress(60);

      let response: Response;

      if (isDirectConvertible) {
        const formDataToSend = new FormData();
        let endpoint = "";

        if ([".docx", ".doc", ".odt", ".txt", ".xlsx", ".xls", ".csv", ".pptx", ".ppt"].includes(format)) {
          endpoint = "/forms/libreoffice/convert";
          formDataToSend.append("files", file, file.name);
        } else if (format === ".html") {
          endpoint = "/forms/chromium/convert/html";
          formDataToSend.append("files", file, "index.html");
        } else if (format === ".md") {
          const mdText = await file.text();
          const htmlContent = await marked.parse(mdText);
          endpoint = "/forms/chromium/convert/html";
          formDataToSend.append("files", new Blob([htmlContent], { type: "text/html" }), "index.html");
        }

        response = await fetch(`${gotenbergUrl}${endpoint}`, {
          method: "POST",
          body: formDataToSend,
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", format);

        response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });
      }

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
