import { useState, useEffect, useCallback, useRef } from "react";
import { clientConvert } from "@/utils/clientConverters";
import type { ConvertStatus } from "./useConvert";

export interface UseClientConvertResult {
  convert: (file: File, fromFormat: string, toFormat: string) => Promise<void>;
  status: ConvertStatus;
  error: string | null;
  progress: number;
  downloadUrl: string | null;
  downloadName: string | null;
}

export function useClientConvert(): UseClientConvertResult {
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current && objectUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const convert = useCallback(
    async (file: File, fromFormat: string, toFormat: string) => {
      setStatus("converting");
      setError(null);
      setProgress(30);
      setDownloadUrl(null);
      setDownloadName(null);

      if (objectUrlRef.current && objectUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      try {
        const result = await clientConvert(file, fromFormat, toFormat);
        setProgress(90);
        const url = URL.createObjectURL(result.blob);
        objectUrlRef.current = url;
        setDownloadUrl(url);
        setDownloadName(result.fileName);
        setStatus("done");
        setProgress(100);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Client-side conversion failed.");
        setProgress(0);
      }
    },
    []
  );

  return { convert, status, error, progress, downloadUrl, downloadName };
}
