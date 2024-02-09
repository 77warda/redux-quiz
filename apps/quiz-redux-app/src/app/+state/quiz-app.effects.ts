import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  catchError,
  of,
  map,
  mergeMap,
  tap,
  switchMap,
  interval,
  takeUntil,
  EMPTY,
  take,
} from 'rxjs';
import { QuizActions } from './quiz-app.actions';
import { QuizApiActions } from './quiz-app.actions';
import { QuizReduxService } from '../quiz-redux.service';
import { Store } from '@ngrx/store';
import { selectTotalQuestions } from './quiz-app.selectors';
import { Router } from '@angular/router';

@Injectable()
export class QuizAppEffects {
  constructor(
    private actions$: Actions,
    private quizService: QuizReduxService,
    private router: Router,
    private store: Store
  ) {}

  loadTrivia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.submitForm),
      mergeMap((action) =>
        this.quizService.getTrivia(action.formValue).pipe(
          tap(() => {
            console.log('Form submitted successfully');
            this.router.navigate(['/quizstart']);
          }),
          switchMap((quizQuestions) => {
            const totalQuestions = action.formValue.numberOfQuestions;
            const timerDuration = totalQuestions * 10;

            console.log('Timer started');
            interval(1000)
              .pipe(
                take(timerDuration + 1),
                tap((timeElapsed) => {
                  const remainingTime = timerDuration - timeElapsed;
                  const minutes = Math.floor(remainingTime / 60);
                  const seconds = remainingTime % 60;
                  const formattedMinutes =
                    minutes < 10 ? '0' + minutes : '' + minutes;
                  const formattedSeconds =
                    seconds < 10 ? '0' + seconds : '' + seconds;
                  // console.log(
                  //   'Time remaining:',
                  //   `${formattedMinutes}:${formattedSeconds}`
                  // );
                  this.store.dispatch(
                    QuizActions.updateTimer({
                      timer: `${formattedMinutes}:${formattedSeconds}`,
                    })
                  );
                  if (remainingTime === 0) {
                    this.store.dispatch(QuizActions.finishQuiz());
                  }
                })
              )
              .subscribe();

            return [QuizApiActions.loadQuestionsSuccess({ quizQuestions })];
          }),
          catchError((error) => {
            console.error('Error in loadTrivia effect:', error);
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
  finishQuiz$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizActions.finishQuiz),
        tap(() => {
          this.router.navigate(['/result']);
        })
      ),
    { dispatch: false }
  );
}
