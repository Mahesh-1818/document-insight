import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { DocumentPreview } from "@/components/DocumentPreview";
import { ModelStatusBar } from "@/components/ModelStatusBar";
import { askQuestion, type QAResult } from "@/lib/api";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<QAResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleAsk = useCallback(
    async (question: string) => {
      if (!file) return;
      setIsLoading(true);
      setResult(null);
      try {
        const res = await askQuestion(file, question);
        setResult(res);
        setHistory((h) => [{ q: question, a: res.answer }, ...h].slice(0, 5));
      } catch {
        // error handling silently
      } finally {
        setIsLoading(false);
      }
    },
    [file]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <FileSearch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">DocQA</h1>
              <p className="text-xs text-muted-foreground font-mono">Layout-Aware Document QA</p>
            </div>
          </div>
          <ModelStatusBar />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gradient-primary mb-1">
            Ask questions about your documents
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload a document image and ask natural language questions. Powered by LayoutLMv3 + OCR.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <div className="space-y-6">
            <DocumentUpload file={file} previewUrl={previewUrl} onFileSelect={handleFileSelect} />
            <QuestionInput onAsk={handleAsk} isLoading={isLoading} disabled={!file} />
            <AnswerDisplay result={result} isLoading={isLoading} />

            {/* History */}
            {history.length > 0 && (
              <div className="glass-panel p-4 space-y-3">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Recent Queries
                </h3>
                {history.map((h, i) => (
                  <div key={i} className="text-xs space-y-0.5 pb-2 border-b border-border last:border-0 last:pb-0">
                    <p className="text-muted-foreground">Q: {h.q}</p>
                    <p className="text-foreground font-medium">A: {h.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel — Document preview */}
          <DocumentPreview previewUrl={previewUrl} boundingBox={result?.boundingBox ?? null} />
        </div>

        {/* Architecture info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-panel p-6"
        >
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
            Pipeline Architecture
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {[
              "Document Upload",
              "OCR (DBNet++ + SATRN)",
              "Text + Coordinates",
              "LayoutLMv3 Encoding",
              "Question Encoding",
              "Span Prediction",
              "Answer Output",
            ].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
