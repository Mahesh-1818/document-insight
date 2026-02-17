import { useState, useCallback } from "react";
import { Upload, FileText, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  previewUrl: string | null;
}

export function DocumentUpload({ onFileSelect, file, previewUrl }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) onFileSelect(droppedFile);
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  const getIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-muted-foreground" />;
    if (file.type.includes("pdf")) return <FileText className="w-8 h-8 text-primary" />;
    return <Image className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Document</label>
      <motion.div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative glass-panel p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-[180px] ${
          isDragging ? "border-primary glow-primary" : "hover:border-muted-foreground/30"
        }`}
        whileHover={{ scale: 1.005 }}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              {previewUrl && file.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md border border-border"
                />
              ) : (
                getIcon()
              )}
              <span className="text-sm font-mono text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              {getIcon()}
              <p className="text-sm text-muted-foreground">
                Drop a document here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground/60">PDF, JPG, PNG supported</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
