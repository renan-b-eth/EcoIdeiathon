"use client";

import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileLoaded: (content: string, fileName: string) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileLoaded, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        alert("Please upload a CSV file");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileLoaded(text, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer",
        isDragging
          ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
          : "border-white/20 hover:border-violet-500/50 hover:bg-white/5",
        isLoading && "pointer-events-none opacity-70"
      )}
    >
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
          <div>
            <p className="text-lg font-semibold text-white">Analyzing your data...</p>
            <p className="text-sm text-gray-400 mt-1">AI is generating insights</p>
          </div>
        </div>
      ) : fileName ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{fileName}</p>
            <p className="text-sm text-gray-400 mt-1">Drop another file to replace</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              Drop your CSV file here
            </p>
            <p className="text-sm text-gray-400 mt-1">
              or click to browse • Supports any .csv file
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-500">Sales data</span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-500">Financial reports</span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-500">Survey results</span>
          </div>
        </div>
      )}
    </div>
  );
}
