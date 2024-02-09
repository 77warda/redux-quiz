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
export const selectCategories = createSelector(
  selectQuizState,
  (state) => state.categories
);

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
    console.log('currentQuestionNumber:', currentQuestionNumber);
    const adjustedIndex = currentQuestionNumber - 1;

    return {
      ...questions[adjustedIndex],
      options:
        questions[adjustedIndex]?.incorrectAnswers
          .concat(questions[adjustedIndex]?.correctAnswer)
          .sort() || [],
    };
  }
);

export const selectCorrectAnswer = createSelector(
  selectCurrentQuestion,
  (currentQuestion) => {
    console.log('correct', currentQuestion?.correctAnswer);
    return currentQuestion?.correctAnswer;
  }
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

export const selectCompleteQuiz = createSelector(
  selectQuestions,
  selectCurrentQuestion,
  selectScore,
  selectCurrentQuestionNumber,
  selectTotalQuestions,
  selectSelectedOption,
  selectUserResponses,
  selectTimer,
  selectCorrectAnswer,
  (
    questions,
    currentQuestion,
    score,
    questionNumber,
    totalQuestions,
    response,
    userResponses,
    timer,
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
      timer,
      correctAnswer,
    };
  }
);
