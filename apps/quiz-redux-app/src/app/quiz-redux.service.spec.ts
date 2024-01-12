import { TestBed } from '@angular/core/testing';

import { QuizReduxService } from './quiz-redux.service';

describe('QuizReduxService', () => {
  let service: QuizReduxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizReduxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
