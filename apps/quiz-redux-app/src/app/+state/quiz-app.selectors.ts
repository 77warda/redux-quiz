import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QUIZ_APP_FEATURE_KEY } from './quiz-app.reducer';
import { Quiz } from '../quiz/quiz.interface';

// Lookup the 'QuizApp' feature state managed by NgRx
// export const selectQuizAppState =
//   createFeatureSelector<Quiz>(QUIZ_APP_FEATURE_KEY);

// const { selectAll, selectEntities } = quizAppAdapter.getSelectors();

// export const selectQuizAppLoaded = createSelector(
//   selectQuizAppState,
//   (state: QuizAppState) => state.loaded
// );

// export const selectQuizAppError = createSelector(
//   selectQuizAppState,
//   (state: QuizAppState) => state.error
// );

// export const selectAllQuizApp = createSelector(
//   selectQuizAppState,
//   (state: QuizAppState) => selectAll(state)
// );

// export const selectQuizAppEntities = createSelector(
//   selectQuizAppState,
//   (state: QuizAppState) => selectEntities(state)
// );

// export const selectSelectedId = createSelector(
//   selectQuizAppState,
//   (state: QuizAppState) => state.selectedId
// );

// export const selectEntity = createSelector(
//   selectQuizAppEntities,
//   selectSelectedId,
//   (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
// );

export const selectQuizState =
  createFeatureSelector<Quiz>(QUIZ_APP_FEATURE_KEY);

// Selectors for individual pieces of state
export const selectQuestions = createSelector(
  selectQuizState,
  (state) => state.questions
);

export const selectCurrentQuestionIndex = createSelector(
  selectQuizState,
  (state) => state.current_Question_Index + 1
);

export const selectTotalQuestions = createSelector(selectQuizState, (state) => {
  console.log('state', state);
  return state.questions.length;
});

export const selectCurrentQuestion = createSelector(
  selectQuestions,
  selectCurrentQuestionIndex,
  (questions, currentIndex) => {
    console.log('current', questions[currentIndex]);
    return questions[currentIndex];
  }
);

export const selectCorrectAnswer = createSelector(
  selectCurrentQuestion,
  (currentQuestion) => {
    console.log('correct', currentQuestion?.correctAnswer);
    return currentQuestion?.correctAnswer;
  }
);
