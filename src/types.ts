export type GradeLevel = "Lớp 10" | "Lớp 11" | "Lớp 12" | "Thi HSG THPT";

export type SubjectCategory = "python" | "cpp" | "algo" | "sql" | "sgk";

export type DifficultyLevel = "Dễ" | "Trung bình" | "Khó" | "HSG";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  socraticQuestions?: string[];
  suggestedSteps?: string[];
}

export interface Problem {
  id: string;
  title: string;
  grade: GradeLevel;
  category: SubjectCategory;
  difficulty: DifficultyLevel;
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  socraticQuestion: string;
  hintSteps: string[];
  starterCode?: {
    python?: string;
    cpp?: string;
    sql?: string;
  };
}

export interface StudentStats {
  streakDays: number;
  questionsAsked: number;
  problemsAttempted: number;
  codesAnalyzed: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}
