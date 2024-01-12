import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import * as QuizActions from './quiz-app.actions';
import { QuizAppEntity } from './quiz-app.models';
import { Quiz } from '../quiz/quiz.interface';

export const QUIZ_APP_FEATURE_KEY = 'quizApp';

export const initialState: Quiz = {
  totalQuestions: 0,
  current_score: 0,
  total_score: 0,
  questions: [],
  options: [],
  currentQuestion: '',
  current_Question_Index: 0,
};

export const quizAppReducer = createReducer(
  initialState,
  on(QuizActions.loadQuestionsSuccess, (state, { questions }) => ({
    ...state,
    questions,
  })),

  on(QuizActions.selectOption, (state, { option }) => ({
    ...state,
    selectedOption: option,
    isOptionSelected: true,
    selectedOptionClass:
      state.questions[state.current_Question_Index].correctAnswer === option
        ? 'correct-answer'
        : 'incorrect-answer',
    correctAnswerClass: 'correct-answer',
  })),

  on(QuizActions.nextQuestion, (state) => {
    const nextIndex = state.current_Question_Index + 1;

    const newState = {
      ...state,
      current_Question_Index: nextIndex,
      currentQuestion: state.questions[nextIndex].question,
      options: state.questions[nextIndex].options,
    };
    return newState;
  }),

  on(QuizActions.restartQuiz, () => initialState)
);
