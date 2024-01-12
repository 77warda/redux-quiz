import { QuizAppEntity } from './quiz-app.models';
import {
  quizAppAdapter,
  QuizAppPartialState,
  initialQuizAppState,
} from './quiz-app.reducer';
import * as QuizAppSelectors from './quiz-app.selectors';

describe('QuizApp Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getQuizAppId = (it: QuizAppEntity) => it.id;
  const createQuizAppEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as QuizAppEntity);

  let state: QuizAppPartialState;

  beforeEach(() => {
    state = {
      quizApp: quizAppAdapter.setAll(
        [
          createQuizAppEntity('PRODUCT-AAA'),
          createQuizAppEntity('PRODUCT-BBB'),
          createQuizAppEntity('PRODUCT-CCC'),
        ],
        {
          ...initialQuizAppState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('QuizApp Selectors', () => {
    it('selectAllQuizApp() should return the list of QuizApp', () => {
      const results = QuizAppSelectors.selectAllQuizApp(state);
      const selId = getQuizAppId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = QuizAppSelectors.selectEntity(state) as QuizAppEntity;
      const selId = getQuizAppId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectQuizAppLoaded() should return the current "loaded" status', () => {
      const result = QuizAppSelectors.selectQuizAppLoaded(state);

      expect(result).toBe(true);
    });

    it('selectQuizAppError() should return the current "error" state', () => {
      const result = QuizAppSelectors.selectQuizAppError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
