import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as QuizAppActions from './quiz-app.actions';
import { QuizAppEffects } from './quiz-app.effects';

describe('QuizAppEffects', () => {
  let actions: Observable<Action>;
  let effects: QuizAppEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        QuizAppEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(QuizAppEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: QuizAppActions.initQuizApp() });

      const expected = hot('-a-|', {
        a: QuizAppActions.loadQuizAppSuccess({ quizApp: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
