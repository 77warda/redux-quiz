import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { QuizAppEffects } from './quiz-app.effects';
import { QuizApiActions, QuizActions } from './quiz-app.actions';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { QuizReduxService } from '../quiz-redux.service';
import { Question } from '../quiz/quiz.interface';

describe('QuizEffects', () => {
  let actions$: Observable<any>;
  let effects: QuizAppEffects;
  let quizService: QuizReduxService;
  let router: Router;
  let store: MockStore;
  const routerSpy = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        QuizAppEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: QuizReduxService,
          useValue: {
            getTrivia: jest.fn(),
            getCategories: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    effects = TestBed.inject(QuizAppEffects);
    quizService = TestBed.inject(QuizReduxService);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('StartTimer$ effect ', () => {
    it('should start the timer when loadQuestionsSuccess action is dispatched', () => {
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });

      actions$ = of(loadQuestionsSuccessAction);

      effects.startTimer$.subscribe(() => {
        expect(quizService.getTrivia).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
          QuizActions.updateTimer({ timer: '05:00' })
        );
      });
    });
    it('should not update the timer when finishQuiz action is dispatched', () => {
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const finishQuizAction = QuizActions.finishQuiz();

      actions$ = of(loadQuestionsSuccessAction, finishQuizAction);

      effects.startTimer$.subscribe(() => {
        expect(quizService.getTrivia).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
          QuizActions.updateTimer({ timer: '05:00' })
        );

        jest.runAllTimers();

        expect(store.dispatch).not.toHaveBeenCalledWith(
          QuizActions.updateTimer({ timer: '04:59' })
        );
      });
    });
  });
  describe('loadTrivia$ Effects', () => {
    let mockQuestions: Question[];
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
    });

    it('should load trivia successfully', () => {
      const quizQuestions = mockQuestions;
      const action = QuizActions.submitForm({
        formValue: { username: 'testUser' },
      });
      actions$ = of(action);

      jest.spyOn(quizService, 'getTrivia').mockReturnValue(of(quizQuestions));

      const expected = QuizApiActions.loadQuestionsSuccess({ quizQuestions });

      effects.loadTrivia$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
    });

    it('should handle errors when loading trivia', () => {
      const error = new Error('Failed to load trivia');
      const action = QuizActions.submitForm({
        formValue: { username: 'testUser' },
      });
      actions$ = of(action);

      jest.spyOn(quizService, 'getTrivia').mockReturnValue(throwError(error));

      const expected = QuizApiActions.loadQuestionsFailure({ error });

      effects.loadTrivia$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
    });
    it('should navigate to "/quizstart" after form submission', () => {
      const action = QuizActions.submitForm({
        formValue: { username: 'testUser' },
      });
      actions$ = of(action);

      const navigateSpy = jest.spyOn(router, 'navigate');

      effects.loadTrivia$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith(['/quizstart']);
      });
    });
  });

  describe('loadCategories$ Effect', () => {
    it('should load categories successfully', () => {
      const categories = { category1: ['category 1', 'category 2'] };
      const action = QuizActions.loadCategories();
      const state = { categories: {} };
      actions$ = of(action);
      store.setState(state);
      jest.spyOn(quizService, 'getCategories').mockReturnValue(of(categories));

      const expected = QuizApiActions.loadCategoriesSuccess({ categories });

      effects.loadCategories$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
    });

    it('should handle errors when loading categories', () => {
      const error = new Error('Failed to load categories');
      const action = QuizActions.loadCategories();
      const state = { categories: {} };
      actions$ = of(action);
      store.setState(state);
      jest
        .spyOn(quizService, 'getCategories')
        .mockReturnValue(throwError(error));

      const expected = QuizApiActions.loadCategoriesFailure({ error });

      effects.loadCategories$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
    });

    it('should not load categories if categories are already loaded', () => {
      const action = QuizActions.loadCategories();
      const state = { categories: { category1: ['category 1', 'category 2'] } };
      actions$ = of(action);
      store.setState(state);

      effects.loadCategories$.subscribe((result) => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('finishQuiz$ Effect', () => {
    it('should navigate to /result when finishQuiz action is dispatched', () => {
      const action = QuizActions.finishQuiz();

      actions$ = of(action);

      effects.finishQuiz$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/result']);
      });
    });
  });
});
