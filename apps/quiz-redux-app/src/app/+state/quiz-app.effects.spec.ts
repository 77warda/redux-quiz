import {
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, map, of, take, tap, throwError, timer } from 'rxjs';
import { QuizAppEffects } from './quiz-app.effects';
import { QuizApiActions, QuizActions } from './quiz-app.actions';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { QuizReduxService } from '../quiz-redux.service';
import { Categories, Question } from '../quiz/quiz.interface';
import { selectTotalQuestions } from './quiz-app.selectors';
import { QuizFinishedComponent } from '../quiz-finished/quiz-finished.component';
import { QuizComponent } from '../quiz/quiz.component';

describe('QuizEffects', () => {
  let actions$: Observable<any>;
  let effects: QuizAppEffects;
  let quizService: QuizReduxService;
  let router: Router;
  let store: MockStore;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'result', component: QuizFinishedComponent },
          { path: 'quizstart', component: QuizComponent },
        ]),
      ],
      providers: [
        QuizAppEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectTotalQuestions, value: 0 }],
        }),
        {
          provide: QuizReduxService,
          useValue: {
            getTrivia: jest.fn(),
            getCategories: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(QuizAppEffects);
    quizService = TestBed.inject(QuizReduxService);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('StartTimer$ effect ', () => {
    it('should not update the timer when finishQuiz action is dispatched', fakeAsync(() => {
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
        expect(quizService.getTrivia).toHaveBeenCalledWith(70);
      });
    }));
    it('should dispatch updateTimer action when remainingTime is not 0', fakeAsync(() => {
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const finishQuiz = QuizActions.finishQuiz();
      actions$ = of(loadQuestionsSuccessAction);
      effects.startTimer$.subscribe(() => {
        tick(1000);
        expect(store.dispatch).toHaveBeenCalledWith(finishQuiz);
      });

      flush();
      discardPeriodicTasks();
    }));
    it('should dispatch updateTimer action when questions are not 0', fakeAsync(() => {
      const spy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectTotalQuestions, 5);
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const updateTimer = QuizActions.updateTimer({
        timer: '00:50',
      });
      actions$ = of(loadQuestionsSuccessAction);
      effects.startTimer$.subscribe();
      tick(1000);
      expect(spy).toHaveBeenCalledWith(updateTimer);
      flush();
      discardPeriodicTasks();
    }));
    it('should dispatch updateTimer action when questions are 0', fakeAsync(() => {
      const spy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectTotalQuestions, 0);
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const updateTimer = QuizActions.updateTimer({
        timer: '00:00',
      });
      actions$ = of(loadQuestionsSuccessAction);
      effects.startTimer$.subscribe();
      tick(1000);
      expect(spy).toHaveBeenCalledWith(updateTimer);
      flush();
      discardPeriodicTasks();
    }));
    it('should dispatch updateTimer action when time is more than 60s ', fakeAsync(() => {
      const spy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectTotalQuestions, 10);
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const updateTimer = QuizActions.updateTimer({
        timer: '01:40',
      });
      actions$ = of(loadQuestionsSuccessAction);
      effects.startTimer$.subscribe();
      tick(1000);
      expect(spy).toHaveBeenCalledWith(updateTimer);
      flush();
      discardPeriodicTasks();
    }));
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

    it('should load trivia successfully', fakeAsync(() => {
      const quizQuestions = mockQuestions;
      const action = QuizActions.submitForm({
        formValue: { username: 'testUser' },
      });
      actions$ = of(action);

      jest.spyOn(quizService, 'getTrivia').mockReturnValue(of(quizQuestions));

      const expected = [
        QuizApiActions.loadQuestionsSuccess({ quizQuestions }),
        QuizActions.startTimer(),
      ];

      let i = 0;
      effects.loadTrivia$.subscribe((result) => {
        expect(result).toEqual(expected[i++]);
      });
      flush();
    }));

    it('should handle errors when loading trivia', fakeAsync(() => {
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
      flush();
    }));

    it('should navigate to "/quizstart" after form submission', fakeAsync(() => {
      const action = QuizActions.submitForm({
        formValue: { username: 'testUser' },
      });
      actions$ = of(action);
      const spy = jest
        .spyOn(quizService, 'getTrivia')
        .mockReturnValue(of(mockQuestions));
      const navigateSpy = jest.spyOn(router, 'navigate');

      effects.loadTrivia$.subscribe((result) => {
        console.log('Effect triggered');
        console.log('result', result);
        expect(navigateSpy).toHaveBeenCalledWith(['/quizstart']);
      });
      tick();
      flush();
    }));
  });

  describe('loadCategories$ Effect', () => {
    let mockCategories: Categories;
    beforeEach(() => {
      mockCategories = { category1: ['category 1', 'category 2'] };
    });
    it('should load Categories successfully', fakeAsync(() => {
      const categories = mockCategories;
      const action = QuizActions.loadCategories();
      jest.spyOn(quizService, 'getCategories').mockReturnValue(of(categories));
      const state = {
        geography: ['countries', 'cities', 'continents'],
        history: ['ancient', 'modern', 'medieval'],
        science: ['biology', 'physics', 'chemistry'],
        sports: ['football', 'basketball', 'tennis'],
        music: ['pop', 'rock', 'jazz'],
      };
      actions$ = of(action);
      store.setState(state);
      const expected = QuizApiActions.loadCategoriesSuccess({ categories });

      effects.loadTrivia$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      flush();
    }));

    it('should filter when categories are not loaded', fakeAsync(() => {
      const action = QuizActions.loadCategories();
      const state = { quizApp: { categories: {} } };
      actions$ = of(action);
      store.setState(state);

      const expected = QuizApiActions.loadCategoriesSuccess({
        categories: {
          geography: ['countries', 'cities', 'continents'],
          history: ['ancient', 'modern', 'medieval'],
          science: ['biology', 'physics', 'chemistry'],
          sports: ['football', 'basketball', 'tennis'],
          music: ['pop', 'rock', 'jazz'],
        },
      });

      jest
        .spyOn(quizService, 'getCategories')
        .mockReturnValue(of(expected.categories));

      effects.loadCategories$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      flush();
    }));

    it('should not load categories if categories are already loaded', fakeAsync(() => {
      const action = QuizActions.loadCategories();

      const stateWithCategories = {
        quizApp: {
          categories: {
            geography: ['countries', 'cities', 'continents'],
            history: ['ancient', 'modern', 'medieval'],
            science: ['biology', 'physics', 'chemistry'],
            sports: ['football', 'basketball', 'tennis'],
            music: ['pop', 'rock', 'jazz'],
          },
        },
      };
      actions$ = of(action);
      store.setState(stateWithCategories);

      effects.loadCategories$.subscribe((result) => {
        expect(result).toBeUndefined();
        expect(quizService.getCategories).not.toHaveBeenCalled();
      });
      flush();
    }));
    it('should handle errors when loading categories', fakeAsync(() => {
      const error = new Error('Failed to load categories');
      const action = QuizActions.loadCategories();
      const state = { quizApp: { categories: {} } };
      actions$ = of(action);
      store.setState(state);
      jest
        .spyOn(quizService, 'getCategories')
        .mockReturnValue(throwError(error));

      const expected = QuizApiActions.loadCategoriesFailure({ error });

      effects.loadCategories$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      flush();
    }));
  });

  describe('finishQuiz$ Effect', () => {
    it('should navigate to /result when finishQuiz action is dispatched', fakeAsync(() => {
      const action = QuizActions.finishQuiz();
      const spy = jest.spyOn(router, 'navigate');
      actions$ = of(action);

      effects.finishQuiz$.subscribe(() => {
        expect(spy).toHaveBeenCalledWith(['/result']);
      });
      flush();
    }));
  });

  describe('Restart Quiz$ Effect', () => {
    it('should navigate to / when restart action is dispatched', fakeAsync(() => {
      const action = QuizActions.restartQuiz();
      const spy = jest.spyOn(router, 'navigate');
      actions$ = of(action);

      effects.restartQuiz$.subscribe(() => {
        expect(spy).toHaveBeenCalledWith(['/']);
      });
      flush();
    }));
  });
});
