import { Question, Quiz } from '../quiz/quiz.interface';
import { QUIZ_APP_FEATURE_KEY } from './quiz-app.reducer';
import {
  selectCurrentQuestionNumber,
  selectTotalQuestions,
  selectCategories,
  selectScore,
  selectQuestions,
  selectCurrentQuestion,
  selectCorrectAnswer,
  selectSelectedOption,
  selectUserResponses,
  selectTimer,
  selectUsername,
  selectSideWindowVisible,
  selectOptionWindowVisible,
} from './quiz-app.selectors';

describe('Quiz App Selectors', () => {
  const mockCurrentQuestion: Question = {
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
  };

  const mockState: Quiz = {
    currentQuestionNumber: 2,
    totalQuestions: 1,
    score: 10,
    currentQuestion: 'Who is the founder of Pakistan?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    selectedOption: undefined,
    correctAnswer: 'Option C',
    response: 'B',
    questions: [
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
    ],
    userResponses: ['A', 'B', 'C'],
    categories: { cat1: ['Category 1', 'Category 2'] },
    timer: '60',
    username: 'user',
    sideWindowVisible: true,
    optionWindowVisible: false,
  };

  const mockRootState = { [QUIZ_APP_FEATURE_KEY]: mockState };

  it('selectCurrentQuestionNumber should return the correct current question number', () => {
    const result = selectCurrentQuestionNumber.projector(mockRootState.quizApp);
    expect(result).toBe(2);
  });

  it('selectTotalQuestions should return the total number of questions', () => {
    const result = selectTotalQuestions.projector(mockRootState.quizApp);
    expect(result).toBe(1);
  });

  it('selectCategories should return the categories', () => {
    const result = selectCategories.projector(mockRootState.quizApp);
    expect(result).toEqual({ cat1: ['Category 1', 'Category 2'] });
  });

  it('selectScore should return the score', () => {
    const result = selectScore.projector(mockRootState.quizApp);
    expect(result).toBe(10);
  });

  it('selectQuestions should return the questions array', () => {
    const result = selectQuestions.projector(mockRootState.quizApp);
    expect(result).toEqual(mockState.questions);
  });

  it('selectSelectedOption should return the selected option', () => {
    const result = selectSelectedOption.projector(mockRootState.quizApp);
    expect(result).toBe('B');
  });

  it('selectUserResponses should return the user responses', () => {
    const result = selectUserResponses.projector(mockRootState.quizApp);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('selectTimer should return the timer value', () => {
    const result = selectTimer.projector(mockRootState.quizApp);
    expect(result).toBe('60');
  });

  it('selectUsername should return the username', () => {
    const result = selectUsername.projector(mockRootState.quizApp);
    expect(result).toBe('user');
  });

  describe('selectCurrentQuestion selector', () => {
    const mockState = {
      questions: [
        {
          question: 'Question 1',
          correctAnswer: 'A',
          incorrectAnswers: ['B', 'C', 'D'],
        },
        {
          question: 'Question 2',
          correctAnswer: 'B',
          incorrectAnswers: ['A', 'C', 'D'],
        },
      ],
    };

    it('selectSideWindowVisible should return the visibility of the side window', () => {
      const result = selectSideWindowVisible.projector(mockRootState.quizApp);
      expect(result).toBe(true);
    });

    it('selectOptionWindowVisible should return the visibility of the option window', () => {
      const result = selectOptionWindowVisible.projector(mockRootState.quizApp);
      expect(result).toBe(false);
    });
  });
  it('should return the correct answer of the current question', () => {
    const result = selectCorrectAnswer.projector(mockCurrentQuestion);
    expect(result).toBe('Option C');
  });
  describe('selectCurrentQuestion selector', () => {
    const mockCurrentQuestionNumber = 1;

    it('should return the current question when it exists', () => {
      const result = selectCurrentQuestion.projector(
        [mockCurrentQuestion],
        mockCurrentQuestionNumber
      );
      expect(result).toEqual({
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
      });
    });

    it('should return null when current question does not exist', () => {
      const result = selectCurrentQuestion.projector(
        [],
        mockCurrentQuestionNumber
      );
      expect(result).toBeNull();
    });
  });
});
