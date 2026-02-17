import { motion } from "framer-motion";
import { CheckCircle, Clock, Sparkles } from "lucide-react";
import type { QAResult } from "@/lib/api";

interface AnswerDisplayProps {
  result: QAResult | null;
  isLoading: boolean;
}

export function AnswerDisplay({ result, isLoading }: AnswerDisplayProps) {
  if (isLoading) {
    return (
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground font-mono">Processing document…</span>
        </div>
        <div className="space-y-2">
          {["OCR Detection (DBNet++)", "Text Recognition (SATRN)", "Layout Analysis (LayoutLMv3)", "Answer Extraction"].map(
            (step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.6 }}
                className="flex items-center gap-2 text-xs"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.6 + 0.5 }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                </motion.div>
                <span className="text-muted-foreground font-mono">{step}</span>
              </motion.div>
            )
          )}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const confidenceColor =
    result.confidence >= 0.9
      ? "text-success"
      : result.confidence >= 0.7
      ? "text-warning"
      : "text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 space-y-4 glow-primary"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono">Answer extracted</span>
      </div>

      <p className="text-lg font-semibold text-foreground leading-relaxed">{result.answer}</p>

      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${confidenceColor} bg-current`} />
          <span className={`text-xs font-mono ${confidenceColor}`}>
            {(result.confidence * 100).toFixed(1)}% confidence
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs font-mono">{result.processingTime}s</span>
        </div>
      </div>
    </motion.div>
  );
}
