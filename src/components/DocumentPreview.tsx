import { motion } from "framer-motion";
import type { BoundingBox } from "@/lib/api";

interface DocumentPreviewProps {
  previewUrl: string | null;
  boundingBox: BoundingBox | null;
}

export function DocumentPreview({ previewUrl, boundingBox }: DocumentPreviewProps) {
  if (!previewUrl) {
    return (
      <div className="glass-panel h-full min-h-[400px] flex items-center justify-center grid-dots">
        <p className="text-sm text-muted-foreground font-mono">No document loaded</p>
      </div>
    );
  }

  return (
    <div className="glass-panel h-full min-h-[400px] relative overflow-hidden">
      <img
        src={previewUrl}
        alt="Document preview"
        className="w-full h-full object-contain"
      />
      {boundingBox && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute border-2 border-primary rounded-sm"
          style={{
            left: `${boundingBox.x}%`,
            top: `${boundingBox.y}%`,
            width: `${boundingBox.width}%`,
            height: `${boundingBox.height}%`,
            backgroundColor: "hsl(210 100% 56% / 0.12)",
            boxShadow: "0 0 12px hsl(210 100% 56% / 0.3)",
          }}
        />
      )}
    </div>
  );
}
