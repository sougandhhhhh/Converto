"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, ArrowLeft, UploadCloud, FileText, X, ArrowRight, RefreshCw, CheckCircle2, Eye, Plus, AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useConvert } from "@/hooks/useConvert";

const FORMAT_CONFIG: Record<string, { title: string, from: string, to: string, accept: any }> = {
  "word-to-pdf": { title: "Word to PDF", from: ".docx", to: ".pdf", accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] } },
  "excel-to-pdf": { title: "Excel to PDF", from: ".xlsx", to: ".pdf", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } },
  "ppt-to-pdf": { title: "PowerPoint to PDF", from: ".pptx", to: ".pdf", accept: { "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"] } },
  "jpg-to-pdf": { title: "JPG to PDF", from: ".jpg", to: ".pdf", accept: { "image/jpeg": [".jpg", ".jpeg"] } },
  "pdf-to-word": { title: "PDF to Word", from: ".pdf", to: ".docx", accept: { "application/pdf": [".pdf"] } },
};

interface FileItem {
  id: string;
  file: File;
}

// Sub-component to handle individual file conversion state using the hook
function FileRow({ item, config, onRemove, forceConvert }: { item: FileItem, config: any, onRemove: (id: string) => void, forceConvert: boolean }) {
  const { convert, status, error, progress, downloadUrl } = useConvert();

  // Trigger conversion when 'Convert All' is pressed at the parent level
  React.useEffect(() => {
    if (forceConvert && status === "idle") {
      convert(item.file, config.from);
    }
  }, [forceConvert, status, convert, item.file, config.from]);

  return (
    <div className="bg-[#211f24] border border-[#494551]/50 rounded-lg p-5 relative overflow-hidden transition-all">
      
      {/* Background Progress Bar for Converting State */}
      {(status === "uploading" || status === "converting") && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#36343a]">
          <div className="h-full bg-[#cfbcff] progress-bar-stripes relative transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }}>
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/20"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded flex items-center justify-center ${
            status === 'done' ? 'bg-[#1B3B24] text-[#A3E5B5]' : 
            status === 'error' ? 'bg-[#3B1B1B] text-[#E5A3A3]' : 'bg-[#6750a4]/20 text-[#cfbcff]'
          }`}>
            {(status === 'uploading' || status === 'converting') ? <RefreshCw size={24} className="animate-spin" /> : 
             status === 'done' ? <CheckCircle2 size={24} /> : 
             status === 'error' ? <AlertCircle size={24} /> :
             <FileText size={24} />}
          </div>
          <div>
            <p className="text-[#e6e0e9] font-medium truncate max-w-[180px] md:max-w-[240px]">
              {status === 'done' ? item.file.name.replace(config.from, config.to) : item.file.name}
            </p>
            <p className="text-sm text-[#948e9c]">
              {status === 'uploading' ? `Uploading...` : 
               status === 'converting' ? `Converting to ${config.to.toUpperCase().replace(".", "")}...` : 
               status === 'error' ? <span className="text-[#E5A3A3]">{error}</span> :
               `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
            </p>
          </div>
        </div>

        {/* Right Side: Actions based on state */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          
          {status === "idle" && (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#36343a] text-[#cbc4d2] border border-[#494551]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#948e9c]"></span> Ready
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemove(item.id)} className="p-2 text-[#948e9c] hover:text-[#ffb4ab] transition-colors rounded hover:bg-[#36343a]">
                  <X size={16} />
                </button>
                <Button onClick={() => convert(item.file, config.from)} className="bg-[#cfbcff] hover:bg-[#e9ddff] text-[#381e72]">
                  Convert
                </Button>
              </div>
            </>
          )}

          {(status === "uploading" || status === "converting") && (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#6750a4]/20 text-[#cfbcff] border border-[#cfbcff]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#cfbcff] animate-ping"></span> {Math.min(progress, 100)}%
              </span>
            </>
          )}

          {status === "done" && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#1B3B24] text-[#A3E5B5] border border-[#2D5A3A]">
                Done
              </span>
              {downloadUrl && (
                <Button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = downloadUrl;
                    a.download = item.file.name.replace(/\.[^/.]+$/, "") + config.to;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="bg-[#cfbcff] hover:bg-[#e9ddff] text-[#381e72] h-8 text-xs px-3 py-1 flex items-center gap-1 font-medium transition-colors cursor-pointer animate-fade-in"
                >
                  Download
                </Button>
              )}
            </div>
          )}

          {status === "error" && (
            <>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemove(item.id)} className="p-2 text-[#948e9c] hover:text-[#ffb4ab] transition-colors rounded hover:bg-[#36343a]">
                  <X size={16} />
                </button>
                <Button onClick={() => convert(item.file, config.from)} className="bg-[#cfbcff] hover:bg-[#e9ddff] text-[#381e72]">
                  Retry
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ConvertPage() {
  const params = useParams();
  const router = useRouter();
  const formatSlug = (params.format as string) || "word-to-pdf";
  const config = FORMAT_CONFIG[formatSlug] || FORMAT_CONFIG["word-to-pdf"];

  const [files, setFiles] = useState<FileItem[]>([]);
  const [forceConvertAll, setForceConvertAll] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newItems = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
      }));
      setFiles(prev => [...prev, ...newItems]);
      setForceConvertAll(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: config.accept,
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: files.length > 0, // Disable click to upload on the wrapper if files exist
    multiple: true,
  });

  const handleConvertAll = () => {
    setForceConvertAll(true);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="bg-[#141218] text-[#e6e0e9] min-h-screen flex flex-col font-sans selection:bg-[#6750a4] selection:text-[#e0d2ff]">
      <header className="bg-[#141218] border-b border-[#494551] flex justify-between items-center w-full px-5 md:px-10 h-16 sticky top-0 z-50">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-2xl font-bold text-[#cfbcff] tracking-tight">CONVERTO</span>
        </div>
        <div className="flex items-center gap-4 text-[#cbc4d2]">
          <button aria-label="settings" className="hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center opacity-80 hover:opacity-100">
            <Settings size={20} />
          </button>
          <button aria-label="help" className="hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center opacity-80 hover:opacity-100">
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center px-5 md:px-10 py-12">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-[#cfbcff] hover:text-[#e9ddff] transition-colors text-sm font-medium group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to formats
            </button>
            
            {files.length > 0 && (
              <Button onClick={handleConvertAll} className="bg-[#cfbcff] hover:bg-[#e9ddff] text-[#381e72] gap-2 shadow-[0_0_15px_rgba(207,188,255,0.2)]">
                Convert All Files
                <ArrowRight size={16} />
              </Button>
            )}
          </div>

          <div {...getRootProps()} className={`w-full ${files.length === 0 ? 'min-h-[320px]' : ''} outline-none`}>
            <input {...getInputProps()} />
            
            {files.length === 0 ? (
              // Empty State Dropzone
              <div className={`w-full h-full bg-[#0f0d13] border-2 ${
                isDragActive ? "border-[#cfbcff] bg-[#1d1b20]" : "border-[#494551]"
              } border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:border-[#cfbcff] group hover:bg-[#1d1b20]`}>
                <div className="w-20 h-20 rounded-full bg-[#211f24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-[#6750a4]/20">
                  <UploadCloud size={40} className="text-[#cbc4d2] group-hover:text-[#cfbcff] transition-colors" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Drop your {config.from} files here</h2>
                <p className="text-[#cbc4d2] mb-6 text-sm">or click to browse from your computer (Multiple allowed)</p>
                <div className="flex items-center gap-2 text-xs font-medium text-[#948e9c]">
                  <span className="px-2 py-1 bg-[#211f24] rounded">Max size: 50MB</span>
                  <span className="px-2 py-1 bg-[#211f24] rounded">Formats: {config.from}</span>
                </div>
              </div>
            ) : (
              // Active Files List
              <div className="flex flex-col gap-4">
                {/* Small dropzone for adding more files when dragging over the area */}
                {isDragActive && (
                  <div className="w-full bg-[#1d1b20] border-2 border-[#cfbcff] border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center">
                     <UploadCloud size={32} className="text-[#cfbcff] mb-2 animate-bounce" />
                     <p className="text-[#cfbcff] font-medium">Drop more files here...</p>
                  </div>
                )}
                
                {files.map(item => (
                  <FileRow 
                    key={item.id} 
                    item={item} 
                    config={config} 
                    onRemove={removeFile}
                    forceConvert={forceConvertAll}
                  />
                ))}

                {/* Add More Files Button underneath the list */}
                {!isDragActive && (
                  <div className="mt-4 flex justify-center">
                    <Button onClick={open} className="bg-[#cfbcff] hover:bg-[#e9ddff] text-[#381e72] gap-2 w-full py-8 text-base shadow-[0_0_15px_rgba(207,188,255,0.2)]">
                      <Plus size={20} />
                      Add more {config.from} files
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-[#141218] border-t border-[#494551] flex flex-col md:flex-row justify-between items-center w-full px-5 md:px-10 py-8 gap-4 mt-auto">
        <div className="text-sm font-bold text-[#cfbcff]">
          © 2026 CONVERTO. Technical Precision.
        </div>
        <div className="flex items-center gap-6">
          <a className="text-sm text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="#">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
