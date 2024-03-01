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
    it('should start the timer when loadQuestionsSuccess action is dispatched', () => {
      const action = QuizApiActions.loadQuestionsSuccess({ quizQuestions: [] });
      const totalQuestions = 5;
      const expectedTimerUpdateAction = QuizActions.updateTimer({
        timer: '05:00',
      });

      store.overrideSelector(selectTotalQuestions, totalQuestions);
      actions$ = of(action);

      effects.startTimer$.subscribe(() => {
        // expect(quizServiceMock.getTrivia).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(expectedTimerUpdateAction);
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
        expect(quizService.getTrivia).toHaveBeenCalledWith(70);
      });
    });
    it('should dispatch updateTimer action when remainingTime is not 0', fakeAsync(() => {
      const timerDuration = 300;
      const timeElapsed = 100;
      const remainingTime = timerDuration - timeElapsed;
      const formattedMinutes = '01';
      const formattedSeconds = '40';

      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const finishQuiz = QuizActions.finishQuiz();
      actions$ = of(loadQuestionsSuccessAction);
      effects.startTimer$.subscribe(() => {
        tick(1000);
        expect(store.dispatch).toHaveBeenCalledWith(finishQuiz);
      });
      // jest.spyOn(store, 'dispatch');
      // effects.startTimer$.subscribe();

      // Simulate the timer elapsing
      // timer(1000)
      //   .pipe(
      //     take(remainingTime + 1),
      //     map((timeElapsed) => timerDuration - timeElapsed),
      //     tap((remainingTime) => {
      //       const minutes = Math.floor(remainingTime / 60);
      //       const seconds = remainingTime % 60;
      //       console.log('mins', minutes);
      //       console.log('seconds', seconds);
      //       // Expectations for minutes and seconds calculation
      //       expect(minutes).toEqual(2);
      //       expect(seconds).toEqual(40);

      //       const expectedTimer = `${formattedMinutes}:${formattedSeconds}`;
      //       expect(store.dispatch).toHaveBeenCalledWith(
      //         QuizActions.updateTimer({ timer: expectedTimer })
      //       );
      //     })
      //   )
      //   .subscribe();

      // Advance the virtual clock to trigger the timer
      flush();
      discardPeriodicTasks();
    }));
    it('select multiple questions', fakeAsync(() => {
      const spy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectTotalQuestions, 5);
      const loadQuestionsSuccessAction = QuizApiActions.loadQuestionsSuccess({
        quizQuestions: [],
      });
      const updateTimer = QuizActions.updateTimer({
        timer: '00:50',
      });
      // const finishQuiz = QuizActions.finishQuiz();

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

    it('should load trivia successfully', () => {
      const quizQuestions = mockQuestions;
      const action = QuizActions.submitForm({
        formValue: { username: 'testUser' },
      });
      actions$ = of(action);

      jest.spyOn(quizService, 'getTrivia').mockReturnValue(of(quizQuestions));

      const expected = QuizApiActions.loadQuestionsSuccess({ quizQuestions });

      effects.loadTrivia$.subscribe((result) => {
        console.log('hello');
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
      // quizService.getCategories.and.returnValue(throwError(error));

      const expected = QuizApiActions.loadCategoriesFailure({ error });

      effects.loadCategories$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      flush();
    }));
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

  describe('Restart Quiz$ Effect', () => {
    it('should navigate to / when restart action is dispatched', () => {
      const action = QuizActions.restartQuiz();

      actions$ = of(action);

      effects.restartQuiz$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });
});
