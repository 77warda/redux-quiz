import { createAction, props } from '@ngrx/store';
import { QuizAppEntity } from './quiz-app.models';
import { Question } from '../quiz/quiz.interface';

export const loadQuestions = createAction('[Quiz] Load Questions');

export const loadQuestionsSuccess = createAction(
  '[Quiz] Load Questions Success',
  props<{ questions: Question[] }>()
);

export const loadQuestionsFailure = createAction(
  '[Quiz] Load Questions Failure',
  props<{ error: any }>()
);

export const selectOption = createAction(
  '[Quiz] Select Option',
  props<{ option: string; isCorrect: boolean }>()
);

export const nextQuestion = createAction('[Quiz] Next Question');
export const restartQuiz = createAction('[Quiz] Restart Quiz');
