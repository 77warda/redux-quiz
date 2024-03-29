export interface Quiz {
  currentQuestionNumber: number;
  totalQuestions: number;
  score: number;
  currentQuestion: string;
  options: string[];
  selectedOption: string | undefined;
  correctAnswer: string;
  response: string;
  questions: Question[];
  userResponses: string[];
  categories: Categories;
  timer: string;
  username: string;
  sideWindowVisible: boolean;
  optionWindowVisible: boolean;
}

export interface Question {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: {
    text: string;
  };
  tags: string[];
  type: string;
  difficulty: string;
  regions: string[];
  isNiche: boolean;
  options: string[];
}

export interface Categories {
  [key: string]: string[];
}
