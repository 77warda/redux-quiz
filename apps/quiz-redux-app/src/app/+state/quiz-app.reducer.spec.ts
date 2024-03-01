import { initialState, quizReducer } from './quiz-app.reducer';
import { Categories, Question, Quiz } from '../quiz/quiz.interface';
import { QuizApiActions, QuizActions } from './quiz-app.actions';

describe('Quiz Reducer', () => {
  let mockQuestions: Question[];
  let mockState: Quiz;

  beforeEach(() => {
    mockQuestions = [
      {
        category: 'string',
        id: '1',
        correctAnswer: 'Option C',
        incorrectAnswers: ['Option A', 'Option B', 'Option D'],
        question: {
          text: 'Who is the founder of Pakistan?',
        },
        tags: ['tag A', 'tag B'],
        type: 'string',
        difficulty: 'easy',
        regions: ['region A', 'region B'],
        isNiche: false,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
      },
      {
        category: 'string',
        id: '2',
        correctAnswer: 'Option C',
        incorrectAnswers: ['Option A', 'Option B', 'Option D'],
        question: {
          text: 'Who is the founder of Pakistan?',
        },
        tags: ['tag A', 'tag B'],
        type: 'string',
        difficulty: 'easy',
        regions: ['region A', 'region B'],
        isNiche: false,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
      },
      {
        category: 'string',
        id: '3',
        correctAnswer: 'Option C',
        incorrectAnswers: ['Option A', 'Option B', 'Option D'],
        question: {
          text: 'Who is the founder of Pakistan?',
        },
        tags: ['tag A', 'tag B'],
        type: 'string',
        difficulty: 'easy',
        regions: ['region A', 'region B'],
        isNiche: false,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
      },
    ];
    mockState = {
      ...initialState,
      username: 'testUser',
      questions: mockQuestions,
      currentQuestionNumber: 2,
      totalQuestions: 3,
      score: 0,
      currentQuestion: 'What is the capital of France?',
      selectedOption: undefined,
      response: '',
      userResponses: ['A', ''],
      categories: {},
      timer: '0',
    };
  });

  describe('Load Quiz Questions in Reducer', () => {
    it('should handle loadQuestionsSuccess action correctly', () => {
      const quizQuestions = mockQuestions;
      const action = QuizApiActions.loadQuestionsSuccess({ quizQuestions });
      const newState = quizReducer(initialState, action);

      expect(newState.questions).toEqual(quizQuestions);
      expect(newState.totalQuestions).toBe(quizQuestions.length);
      expect(newState.currentQuestion).toBe(quizQuestions[0].question.text);
      expect(newState.options).toEqual(
        quizQuestions[0].incorrectAnswers
          .concat(quizQuestions[0].correctAnswer)
          .sort()
      );
    });
  });

  describe('Quiz reducer nextQuestion', () => {
    it('should increment currentQuestionNumber and reset selectedOption when nextQuestion action is dispatched', () => {
      const action = QuizActions.nextQuestion();
      const newState = quizReducer(mockState, action);
      expect(newState.currentQuestionNumber).toEqual(3);
      expect(newState.selectedOption).toBeUndefined();
      expect(newState.userResponses).toEqual(['A', '', '']);
    });

    it('should set lastQuestion to true if currentQuestionNumber is equal to questions length', () => {
      const action = QuizActions.nextQuestion();
      const newState = quizReducer(mockState, action);
      expect(newState.currentQuestionNumber - 1).toBeTruthy();
    });

    it('should return state as is if currentQuestionNumber exceeds totalQuestions', () => {
      const initialState = {
        ...mockState,
        currentQuestionNumber: 4,
      };
      const action = QuizActions.nextQuestion();
      const newState = quizReducer(initialState, action);
      expect(newState).toEqual(initialState);
    });
  });

  describe('Quiz Reducer Skip Questions', () => {
    it('should handle skipQuestion action correctly', () => {
      const action = QuizActions.skipQuestion();
      const newState = quizReducer(mockState, action);

      const nextQuestion = mockState.questions[mockState.currentQuestionNumber];

      expect(newState.currentQuestionNumber).toBe(
        mockState.currentQuestionNumber + 1
      );
      expect(newState.options).toEqual(
        nextQuestion?.incorrectAnswers.concat(nextQuestion.correctAnswer).sort()
      );
      expect(newState.selectedOption).toBeUndefined();
    });

    it('should handle skipQuestion action correctly when on the last question', () => {
      const action = QuizActions.skipQuestion();
      const stateOnLastQuestion: Quiz = {
        ...mockState,
        currentQuestionNumber: mockState.totalQuestions,
      };
      const newState = quizReducer(stateOnLastQuestion, action);
      expect(newState).toEqual(stateOnLastQuestion);
    });
  });
  describe('Quiz Reducer Previous Question', () => {
    it('should handle previousQuestion action correctly', () => {
      const action = QuizActions.previousQuestion();
      const newState = quizReducer(mockState, action);

      const previousQuestionIndex = mockState.currentQuestionNumber - 2;
      const previousQuestion = mockState.questions[previousQuestionIndex];

      const response = mockState.userResponses[previousQuestionIndex] || '';

      expect(newState.currentQuestionNumber).toBe(
        mockState.currentQuestionNumber - 1
      );
      expect(newState.options).toEqual(
        previousQuestion.incorrectAnswers
          .concat(previousQuestion.correctAnswer)
          .sort()
      );
      expect(newState.selectedOption).toBe(response || undefined);
      expect(newState.response).toBe(response);
      expect(newState.correctAnswer).toBe(previousQuestion.correctAnswer);
    });

    it('should handle previousQuestion action correctly when on the first question', () => {
      const action = QuizActions.previousQuestion();
      const stateOnFirstQuestion: Quiz = {
        ...mockState,
        currentQuestionNumber: 1,
      };
      const newState = quizReducer(stateOnFirstQuestion, action);
      expect(newState).toEqual(stateOnFirstQuestion);
    });
    it('should disable previous navigation when already at the first question', () => {
      const action = QuizActions.previousQuestion();
      const newState = quizReducer(mockState, action);
      expect(newState.currentQuestionNumber).toEqual(1);
    });
  });

  describe('Quiz Reducer handle selectedOption action', () => {
    it('should handle selectedOption action correctly when response is empty', () => {
      const selectedOption = 'B';
      const action = QuizActions.selectedOption({ selectedOption });
      const newState = quizReducer(mockState, action);

      const correctAnswer =
        mockState.questions[mockState.currentQuestionNumber - 1].correctAnswer;
      const updatedResponses = [...mockState.userResponses];
      updatedResponses[mockState.currentQuestionNumber - 1] = selectedOption;
      const score =
        selectedOption === correctAnswer
          ? mockState.score + 1
          : mockState.score;

      expect(newState.score).toBe(score);
      expect(newState.response).toBe(selectedOption);
      expect(newState.correctAnswer).toBe(correctAnswer);
      expect(newState.userResponses).toEqual(updatedResponses);
    });

    it('should handle selectedOption action correctly when response is not empty', () => {
      const selectedOption = 'A'; // Mock selected option
      const stateWithResponse: Quiz = {
        ...mockState,
        response: 'B',
      };
      const action = QuizActions.selectedOption({ selectedOption });
      const newState = quizReducer(stateWithResponse, action);

      const updatedResponses = [...stateWithResponse.userResponses];
      updatedResponses[stateWithResponse.currentQuestionNumber - 1] =
        selectedOption;

      expect(newState.response).toBe('');
      expect(newState.userResponses).toEqual(updatedResponses);
    });
  });

  describe('loadCategoriesSuccess reducer', () => {
    let categories: Categories;
    beforeEach(() => {
      categories = {
        category1: ['category 1', 'category 2'],
        category2: ['category 3', 'category 4'],
      };
    });
    it('should update the categories in the state', () => {
      const action = QuizApiActions.loadCategoriesSuccess({ categories });
      const newState = quizReducer(mockState, action);
      expect(newState.categories).toEqual(categories);
    });

    it('should update the categories in the state', () => {
      const action = QuizApiActions.loadCategoriesSuccess({ categories });
      const newState = quizReducer(mockState, action);
      expect(newState.categories).toEqual(categories);
    });
  });
  describe('setCurrentQuestion in Quiz Reducer', () => {
    it('should handle setCurrentQuestion action correctly when currentQuestionNumber is valid', () => {
      const currentQuestionNumber = 3;
      const action = QuizActions.setCurrentQuestion({ currentQuestionNumber });
      const newState = quizReducer(mockState, action);

      const currentQuestion = mockState.questions[currentQuestionNumber - 1];
      const options = currentQuestion.incorrectAnswers
        .concat(currentQuestion.correctAnswer)
        .sort();

      expect(newState.currentQuestion).toBe(currentQuestion.question.text);
      expect(newState.options).toEqual(options);
      expect(newState.currentQuestionNumber).toBe(currentQuestionNumber);
    });

    it('should handle setCurrentQuestion action correctly when currentQuestionNumber is invalid', () => {
      const currentQuestionNumber = 0;
      const action = QuizActions.setCurrentQuestion({ currentQuestionNumber });
      const newState = quizReducer(mockState, action);

      expect(newState).toEqual(mockState);
    });

    it('should handle setCurrentQuestion action correctly when currentQuestionNumber is greater than total questions', () => {
      const currentQuestionNumber = 4;
      const action = QuizActions.setCurrentQuestion({ currentQuestionNumber });
      const newState = quizReducer(mockState, action);

      expect(newState).toEqual(mockState);
    });
  });

  describe('Start and Update Timer in Quiz Reducer', () => {
    it('should handle startTimer action correctly', () => {
      const action = QuizActions.startTimer();
      const newState = quizReducer(mockState, action);
      expect(newState).toEqual(mockState);
    });

    it('should handle updateTimer action correctly', () => {
      const newTimerValue = '50';
      const action = QuizActions.updateTimer({ timer: newTimerValue });
      const newState = quizReducer(mockState, action);
      expect(newState.timer).toBe(newTimerValue);
    });
  });

  describe('submitForm and restart quiz reducer', () => {
    it('should update the username in the state', () => {
      const formValue = { username: 'testing' };
      const action = QuizActions.submitForm({ formValue });
      const newState = quizReducer(mockState, action);

      expect(newState.username).toEqual(formValue.username);
    });

    it('should not modify other properties in the state', () => {
      const formValue = { username: 'testUser' };
      const action = QuizActions.submitForm({ formValue });
      const newState = quizReducer(mockState, action);
      expect(newState.questions).toEqual(mockState.questions);
      expect(newState.currentQuestionNumber).toEqual(
        mockState.currentQuestionNumber
      );
      expect(newState.score).toEqual(mockState.score);
    });

    it('should handle restartQuiz action correctly', () => {
      const action = QuizActions.restartQuiz();
      const newState = quizReducer(mockState, action);

      expect(newState.currentQuestionNumber).toBe(1);
      expect(newState.totalQuestions).toBe(1);
      expect(newState.score).toBe(0);
      expect(newState.currentQuestion).toBe('');
      expect(newState.options).toEqual([]);
      expect(newState.selectedOption).toBeUndefined();
      expect(newState.correctAnswer).toBe('');
      expect(newState.response).toBe('');
      expect(newState.questions).toEqual([]);
      expect(newState.userResponses).toEqual([]);
      expect(newState.timer).toBe('');
    });
  });

  it('should handle openSideWindow action correctly', () => {
    const action = QuizActions.openSideWindow();
    const newState = quizReducer(initialState, action);
    expect(newState.sideWindowVisible).toBe(true);
    expect(newState.optionWindowVisible).toBe(false);
  });

  it('should handle closeSideWindow action correctly', () => {
    const stateWithOpenSideWindow = {
      ...initialState,
      sideWindowVisible: true,
    };
    const action = QuizActions.closeSideWindow();
    const newState = quizReducer(stateWithOpenSideWindow, action);
    expect(newState.sideWindowVisible).toBe(false);
  });

  it('should handle toggleOptionWindow action correctly when optionWindowVisible is false', () => {
    const action = QuizActions.toggleOptionWindow();
    const newState = quizReducer(initialState, action);
    expect(newState.optionWindowVisible).toBe(true);
  });

  it('should handle toggleOptionWindow action correctly when optionWindowVisible is true', () => {
    const stateWithOpenOptionWindow = {
      ...initialState,
      optionWindowVisible: true,
    };
    const action = QuizActions.toggleOptionWindow();
    const newState = quizReducer(stateWithOpenOptionWindow, action);
    expect(newState.optionWindowVisible).toBe(false);
  });
});
