import { createSelector, createFeatureSelector } from '@ngrx/store';
import { QUIZ_APP_FEATURE_KEY } from './quiz-app.reducer';
import { Quiz } from '../quiz/quiz.interface';

// Get the feature state
export const selectQuizState =
  createFeatureSelector<Quiz>(QUIZ_APP_FEATURE_KEY);

export const selectCurrentQuestionNumber = createSelector(
  selectQuizState,
  (state: Quiz) => state.currentQuestionNumber
);

export const selectTotalQuestions = createSelector(
  selectQuizState,
  (state: Quiz) => {
    return state.questions.length;
  }
);
export const selectCategories = createSelector(selectQuizState, (state) => {
  console.log(state.categories);
  return state.categories;
});

export const selectScore = createSelector(
  selectQuizState,
  (state: Quiz) => state.score
);

export const selectQuestions = createSelector(
  selectQuizState,
  (state) => state.questions
);

export const selectCurrentQuestion = createSelector(
  selectQuestions,
  selectCurrentQuestionNumber,
  (questions, currentQuestionNumber) => {
    // console.log('currentQuestionNumber:', currentQuestionNumber);
    const adjustedIndex = currentQuestionNumber - 1;
    const currentQuestion = questions[adjustedIndex];

    if (!currentQuestion) {
      return null;
    }

    const options = currentQuestion.incorrectAnswers
      ? [
          ...currentQuestion.incorrectAnswers,
          currentQuestion.correctAnswer,
        ].sort()
      : [currentQuestion.correctAnswer];

    return {
      ...currentQuestion,
      options,
    };
  }
);

export const selectCorrectAnswer = createSelector(
  selectCurrentQuestion,
  (currentQuestion) => currentQuestion?.correctAnswer
);

export const selectSelectedOption = createSelector(selectQuizState, (state) => {
  return state.response;
});
export const selectUserResponses = createSelector(selectQuizState, (state) => {
  return state.userResponses;
});
export const selectTimer = createSelector(
  selectQuizState,
  (state: Quiz) => state.timer
);

export const selectUsername = createSelector(
  selectQuizState,
  (state) => state.username
);

export const selectSideWindowVisible = createSelector(
  selectQuizState,
  (state) => state.sideWindowVisible
);

export const selectOptionWindowVisible = createSelector(
  selectQuizState,
  (state) => state.optionWindowVisible
);

export const selectCompleteQuiz = createSelector(
  selectQuestions,
  selectCurrentQuestion,
  selectScore,
  selectCurrentQuestionNumber,
  selectTotalQuestions,
  selectSelectedOption,
  selectUserResponses,
  selectTimer,
  selectUsername,
  selectCorrectAnswer,
  selectSideWindowVisible,
  selectOptionWindowVisible,
  (
    questions,
    currentQuestion,
    score,
    questionNumber,
    totalQuestions,
    response,
    userResponses,
    timer,
    username,
    correctAnswer,
    selectSideWindowVisible,
    selectOptionWindowVisible
  ) => {
    return {
      questions,
      currentQuestion,
      score,
      questionNumber,
      totalQuestions,
      response,
      userResponses,
      timer,
      username,
      correctAnswer,
      selectSideWindowVisible,
      selectOptionWindowVisible,
    };
  }
);

export const selectFinishQuiz = createSelector(
  selectQuestions,
  selectCurrentQuestion,
  selectScore,
  selectCurrentQuestionNumber,
  selectTotalQuestions,
  selectSelectedOption,
  selectUserResponses,
  selectUsername,
  selectCorrectAnswer,
  (
    questions,
    currentQuestion,
    score,
    questionNumber,
    totalQuestions,
    response,
    userResponses,
    username,
    correctAnswer
  ) => {
    return {
      questions,
      currentQuestion,
      score,
      questionNumber,
      totalQuestions,
      response,
      userResponses,
      username,
      correctAnswer,
    };
  }
);
