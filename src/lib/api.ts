export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QAResult {
  answer: string;
  confidence: number;
  boundingBox: BoundingBox;
  processingTime: number;
}

export interface ModelStatus {
  ocr: "ready" | "loading" | "error";
  layoutlm: "ready" | "loading" | "error";
}

const MOCK_ANSWERS: Record<string, QAResult> = {
  default: {
    answer: "The total amount due is $1,250.00",
    confidence: 0.94,
    boundingBox: { x: 55, y: 40, width: 30, height: 6 },
    processingTime: 2.3,
  },
};

export async function askQuestion(
  _file: File,
  question: string
): Promise<QAResult> {
  // Simulate API call delay
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500));

  const lowerQ = question.toLowerCase();
  let answer = MOCK_ANSWERS.default;

  if (lowerQ.includes("date")) {
    answer = {
      answer: "January 15, 2026",
      confidence: 0.91,
      boundingBox: { x: 60, y: 15, width: 25, height: 5 },
      processingTime: 1.8,
    };
  } else if (lowerQ.includes("name") || lowerQ.includes("who")) {
    answer = {
      answer: "Acme Corporation Ltd.",
      confidence: 0.97,
      boundingBox: { x: 10, y: 8, width: 35, height: 7 },
      processingTime: 1.5,
    };
  } else if (lowerQ.includes("address")) {
    answer = {
      answer: "123 Business Ave, Suite 400, New York, NY 10001",
      confidence: 0.88,
      boundingBox: { x: 10, y: 16, width: 40, height: 10 },
      processingTime: 2.1,
    };
  }

  return { ...answer, processingTime: +(1 + Math.random() * 2).toFixed(1) };
}

export function getModelStatus(): ModelStatus {
  return { ocr: "ready", layoutlm: "ready" };
}
