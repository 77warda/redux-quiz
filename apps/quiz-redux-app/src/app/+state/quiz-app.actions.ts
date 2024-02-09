// import { createAction, props } from '@ngrx/store';
// import { QuizAppEntity } from './quiz-app.models';
// import { Question } from '../quiz/quiz.interface';

// export const loadQuestions = createAction('[Quiz] Load Questions');

// export const loadQuestionsSuccess = createAction(
//   '[Quiz] Load Questions Success',
//   props<{ questions: Question[] }>()
// );

// export const loadQuestionsFailure = createAction(
//   '[Quiz] Load Questions Failure',
//   props<{ error: any }>()
// );
// export const setCurrentQuestionIndex = createAction(
//   '[Quiz] Set Current Question Index',
//   props<{ index: number }>()
// );

// export const selectOption = createAction(
//   '[Quiz] Select Option',
//   props<{ option: string; isCorrect: boolean }>()
// );

// export const nextQuestion = createAction('[Quiz] Next Question');
// export const skipQuestion = createAction('[Quiz] Skip Question');
// export const previousQuestion = createAction('[Quiz] Previous Question');
// export const updateScore = createAction(
//   '[Quiz] Update Score',
//   props<{ score: number }>()
// );

// export const restartQuiz = createAction('[Quiz] Restart Quiz');

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Categories, Question } from '../quiz/quiz.interface';

export const QuizActions = createActionGroup({
  source: 'Quiz',
  events: {
    Enter: emptyProps(),
    'Load Quiz Questions': emptyProps(),
    'Next Question': emptyProps(),
    'Selected Option': props<{ selectedOption: string }>(),
    'Skip Question': emptyProps(),
    'Restart Quiz': emptyProps(),
    'Previous Question': emptyProps(),
    'load Categories': emptyProps(),
    'submit Form': props<{ formValue: any }>(),
    'set Current Question': props<{ currentQuestionNumber: number }>(),
    'Finish Quiz': emptyProps(),
    'Start Timer': emptyProps(),
    'Stop Timer': emptyProps(),
    'Update Timer': props<{ timer: string }>(),
  },
});

export const QuizApiActions = createActionGroup({
  source: 'Quiz/API',
  events: {
    'load questions Success': props<{ quizQuestions: Question[] }>(),
    'load questions  Failure': props<{ error: any }>(),
    'load Categories Success': props<{ categories: Categories }>(),
    'load Categories Failure': props<{ error: any }>(),
  },
});
