import { useState, useEffect } from "react";
import { getModelStatus, type ModelStatus } from "@/lib/api";

const statusColors: Record<ModelStatus["ocr"], string> = {
  ready: "bg-success",
  loading: "bg-warning animate-pulse",
  error: "bg-destructive",
};

export function ModelStatusBar() {
  const [status, setStatus] = useState<ModelStatus>({ ocr: "loading", layoutlm: "loading" });

  useEffect(() => {
    getModelStatus().then(setStatus);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {(["ocr", "layoutlm"] as const).map((key) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status[key]]}`} />
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {key === "ocr" ? "OCR" : "LayoutLM"}
          </span>
        </div>
      ))}
    </div>
  );
}
