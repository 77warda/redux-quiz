export interface Quiz {
  totalQuestions: number;
  current_score: number;
  current_Question_Index: number;
  currentQuestion: string;
  total_score: number;
  questions: Question[];
  options: string[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}
