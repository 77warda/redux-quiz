import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  switchMap,
  catchError,
  of,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { QuizActions } from './quiz-app.actions';
import { QuizApiActions } from './quiz-app.actions';
import * as QuizAppFeature from './quiz-app.reducer';
import { QuizReduxService } from '../quiz-redux.service';
import { Question } from '../quiz/quiz.interface';
import { Store, select } from '@ngrx/store';
import {} from './quiz-app.selectors';

@Injectable()
export class QuizAppEffects {
  constructor(
    private actions$: Actions,
    private quizService: QuizReduxService
  ) {}

  loadTrivia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.submitForm),
      mergeMap((action) =>
        this.quizService.getTrivia(action.formValue).pipe(
          tap((data) => {
            console.log('Service Data:', data);
          }),
          map((quizQuestions) =>
            QuizApiActions.loadQuestionsSuccess({ quizQuestions })
          ),
          catchError((error) => {
            console.error('Error in loadTodos effect:', error);
            return of(QuizApiActions.loadQuestionsFailure({ error }));
          })
        )
      )
    )
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadCategories),
      mergeMap(() =>
        this.quizService.getCategories().pipe(
          map((categories) =>
            QuizApiActions.loadCategoriesSuccess({ categories })
          ),
          catchError((error) =>
            of(QuizApiActions.loadCategoriesFailure({ error }))
          )
        )
      )
    )
  );
}
