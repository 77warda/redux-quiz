import { createReducer, on } from '@ngrx/store';
import { QuizActions } from './quiz-app.actions';
import { QuizApiActions } from './quiz-app.actions';
import { Quiz } from '../quiz/quiz.interface';

export const QUIZ_APP_FEATURE_KEY = 'quizApp';

export const initialState: Quiz = {
  currentQuestionNumber: 1,
  totalQuestions: 1,
  score: 0,
  currentQuestion: '',
  options: [],
  selectedOption: undefined,
  correctAnswer: '',
  response: '',
  questions: [],
  userResponses: [],
  categories: {},
  timer: '',
  username: '',
};

export const quizReducer = createReducer(
  initialState,
  on(QuizApiActions.loadQuestionsSuccess, (state, { quizQuestions }) => ({
    ...state,
    questions: quizQuestions,
    totalQuestions: quizQuestions.length,
    currentQuestion:
      quizQuestions[state.currentQuestionNumber - 1].question.text,
    options: quizQuestions[state.currentQuestionNumber - 1].incorrectAnswers
      .concat(quizQuestions[state.currentQuestionNumber - 1].correctAnswer)
      .sort(),
  })),
  on(QuizActions.nextQuestion, (state) => {
    const currentQuestionIndex = state.currentQuestionNumber;
    const nextQuestion = state.questions[currentQuestionIndex];
    const currentResponse = state.userResponses[currentQuestionIndex] || '';
    const correctAnswer = nextQuestion.correctAnswer;
    if (state.currentQuestionNumber <= state.totalQuestions) {
      const nextQuestion = state.questions[state.currentQuestionNumber];

      // Save the response before moving to the next question
      const updatedUserResponses = [...state.userResponses];
      updatedUserResponses[currentQuestionIndex] = currentResponse;
      return {
        ...state,
        currentQuestionNumber: state.currentQuestionNumber + 1,
        options: nextQuestion.incorrectAnswers
          .concat(nextQuestion.correctAnswer)
          .sort(),
        selectedOption: undefined,
        response: currentResponse,
        userResponses: updatedUserResponses,
        correctAnswer,
      };
    } else {
      return {
        ...state,
      };
    }
  }),
  on(QuizActions.skipQuestion, (state) => {
    if (state.currentQuestionNumber < state.totalQuestions) {
      const nextQuestion = state.questions[state.currentQuestionNumber];
      return {
        ...state,
        currentQuestionNumber: state.currentQuestionNumber + 1,
        options: nextQuestion.incorrectAnswers
          .concat(nextQuestion.correctAnswer)
          .sort(),
        selectedOption: undefined,
      };
    } else {
      return { ...state };
    }
  }),
  on(QuizActions.previousQuestion, (state) => {
    if (state.currentQuestionNumber > 1) {
      const previousQuestionIndex = state.currentQuestionNumber - 2;
      const previousQuestion = state.questions[previousQuestionIndex];
      const response = state.userResponses[previousQuestionIndex] || '';
      const correctAnswer = previousQuestion.correctAnswer;
      console.log(previousQuestionIndex);
      return {
        ...state,
        currentQuestionNumber: state.currentQuestionNumber - 1,
        options: previousQuestion.incorrectAnswers
          .concat(previousQuestion.correctAnswer)
          .sort(),
        selectedOption: response || undefined,
        response,
        correctAnswer,
      };
    } else {
      return { ...state };
    }
  }),
  on(QuizActions.selectedOption, (state, { selectedOption }) => {
    const correctAnswer =
      state.questions[state.currentQuestionNumber - 1].correctAnswer;
    const updatedResponses = [...state.userResponses];
    updatedResponses[state.currentQuestionNumber - 1] = selectedOption;
    if (!state.response) {
      const score =
        selectedOption === correctAnswer ? state.score + 1 : state.score;
      return {
        ...state,
        score,
        response: selectedOption,
        correctAnswer,
        userResponses: updatedResponses,
      };
    } else {
      return {
        ...state,
        response: '',
        userResponses: updatedResponses,
      };
    }
  }),
  on(QuizActions.restartQuiz, (state) => ({
    ...state,
    currentQuestionNumber: 1,
    totalQuestions: 1,
    score: 0,
    currentQuestion: '',
    options: [],
    selectedOption: undefined,
    correctAnswer: '',
    response: '',
    questions: [],
    userResponses: [],
    timer: '',
  })),
  on(QuizApiActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
  })),
  on(QuizActions.setCurrentQuestion, (state, { currentQuestionNumber }) => {
    if (
      currentQuestionNumber > 0 &&
      currentQuestionNumber <= state.questions.length
    ) {
      const currentQuestion = state.questions[currentQuestionNumber - 1];
      return {
        ...state,
        currentQuestion: currentQuestion.question.text,
        options: currentQuestion.incorrectAnswers
          .concat(currentQuestion.correctAnswer)
          .sort(),
        currentQuestionNumber: currentQuestionNumber,
      };
    }
    return state;
  }),
  on(QuizActions.startTimer, (state) => state),
  on(QuizActions.updateTimer, (state, { timer }) => ({ ...state, timer })),
  on(QuizActions.submitForm, (state, { formValue }) => ({
    ...state,
    username: formValue.username,
  }))
);
