import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionInputProps {
  onAsk: (question: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export function QuestionInput({ onAsk, isLoading, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading && !disabled) {
      onAsk(question.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="text-sm font-medium text-foreground">Question</label>
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What is the total amount due?"
          disabled={disabled}
          className="w-full px-4 py-3 pr-14 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm disabled:opacity-40"
        />
        <motion.button
          type="submit"
          disabled={!question.trim() || isLoading || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
}
