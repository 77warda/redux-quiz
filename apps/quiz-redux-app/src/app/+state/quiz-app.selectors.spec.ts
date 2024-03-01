import { QuizAppEntity } from './quiz-app.models';
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
  selectCompleteQuiz,
  selectSideWindowVisible,
  selectOptionWindowVisible,
} from './quiz-app.selectors';

describe('Quiz App Selectors', () => {
  const mockState = {
    currentQuestionNumber: 2,
    questions: [
      {
        question: 'Question 1',
        correctAnswer: 'A',
        options: ['A', 'B', 'C', 'D'],
      },
      {
        question: 'Question 2',
        correctAnswer: 'B',
        options: ['A', 'B', 'C', 'D'],
      },
      {
        question: 'Question 3',
        correctAnswer: 'C',
        options: ['A', 'B', 'C', 'D'],
      },
    ],
    categories: ['Category 1', 'Category 2'],
    score: 10,
    response: 'B',
    userResponses: ['A', 'B', 'C'],
    timer: 60,
    username: 'user',
    sideWindowVisible: true,
    optionWindowVisible: false,
  };

  const mockRootState = { quizApp: mockState };

  it('selectCurrentQuestionNumber should return the correct current question number', () => {
    const result = selectCurrentQuestionNumber(mockRootState);
    expect(result).toBe(2);
  });

  it('selectTotalQuestions should return the total number of questions', () => {
    const result = selectTotalQuestions(mockRootState);
    expect(result).toBe(3);
  });

  it('selectCategories should return the categories', () => {
    const result = selectCategories(mockRootState);
    expect(result).toEqual(['Category 1', 'Category 2']);
  });

  it('selectScore should return the score', () => {
    const result = selectScore(mockRootState);
    expect(result).toBe(10);
  });

  it('selectQuestions should return the questions array', () => {
    const result = selectQuestions(mockRootState);
    expect(result).toEqual(mockState.questions);
  });

  it('selectSelectedOption should return the selected option', () => {
    const result = selectSelectedOption(mockRootState);
    expect(result).toBe('B');
  });

  it('selectUserResponses should return the user responses', () => {
    const result = selectUserResponses(mockRootState);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('selectTimer should return the timer value', () => {
    const result = selectTimer(mockRootState);
    expect(result).toBe(60);
  });

  it('selectUsername should return the username', () => {
    const result = selectUsername(mockRootState);
    expect(result).toBe('user');
  });
  it('selectCorrectAnswer should return the correct answer when current question is available', () => {
    const result = selectCorrectAnswer(mockRootState);
    expect(result).toEqual('B');
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

    it('should return null when currentQuestionNumber is valid but there are no questions', () => {
      const mockRootState = {
        quizApp: { questions: [], currentQuestionNumber: 1 },
      };
      const result = selectCurrentQuestion(mockRootState);
      expect(result).toBeNull();
    });

    it('should return null when currentQuestionNumber is invalid', () => {
      const mockRootState = {
        quizApp: { ...mockState, currentQuestionNumber: 0 },
      };
      const result = selectCurrentQuestion(mockRootState);
      expect(result).toBeNull();
    });
    it('selectSideWindowVisible should return the visibility of the side window', () => {
      const result = selectSideWindowVisible(mockRootState);
      expect(result).toBe(true);
    });

    it('selectOptionWindowVisible should return the visibility of the option window', () => {
      const result = selectOptionWindowVisible(mockRootState);
      expect(result).toBe(false);
    });
    it('should return current question with options including incorrect answers and correct answer', () => {
      const mockRootState = {
        quizApp: { ...mockState, currentQuestionNumber: 1 },
      };
      const result = selectCurrentQuestion(mockRootState);
      expect(result).toEqual({
        question: 'Question 1',
        correctAnswer: 'A',
        incorrectAnswers: ['B', 'C', 'D'],
        options: ['A', 'B', 'C', 'D'],
      });
    });
  });
});
