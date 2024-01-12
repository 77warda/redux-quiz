import { Action } from '@ngrx/store';

import * as QuizAppActions from './quiz-app.actions';
import { QuizAppEntity } from './quiz-app.models';
import {
  QuizAppState,
  initialQuizAppState,
  quizAppReducer,
} from './quiz-app.reducer';

describe('QuizApp Reducer', () => {
  const createQuizAppEntity = (id: string, name = ''): QuizAppEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid QuizApp actions', () => {
    it('loadQuizAppSuccess should return the list of known QuizApp', () => {
      const quizApp = [
        createQuizAppEntity('PRODUCT-AAA'),
        createQuizAppEntity('PRODUCT-zzz'),
      ];
      const action = QuizAppActions.loadQuizAppSuccess({ quizApp });

      const result: QuizAppState = quizAppReducer(initialQuizAppState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = quizAppReducer(initialQuizAppState, action);

      expect(result).toBe(initialQuizAppState);
    });
  });
});
