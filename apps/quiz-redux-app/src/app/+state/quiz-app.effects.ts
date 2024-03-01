import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import {
  catchError,
  of,
  map,
  mergeMap,
  tap,
  switchMap,
  interval,
  takeUntil,
  filter,
} from 'rxjs';
import { QuizActions } from './quiz-app.actions';
import { QuizApiActions } from './quiz-app.actions';
import { QuizReduxService } from '../quiz-redux.service';
import { Store } from '@ngrx/store';
import { selectCategories, selectTotalQuestions } from './quiz-app.selectors';
import { Router } from '@angular/router';

@Injectable()
export class QuizAppEffects {
  constructor(
    private actions$: Actions,
    private quizService: QuizReduxService,
    private router: Router,
    private store: Store
  ) {}

  startTimer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizApiActions.loadQuestionsSuccess),
        concatLatestFrom(() => this.store.select(selectTotalQuestions)),
        tap(() => console.log('hello')),
        switchMap(([action, totalQuestions]) => {
          const timerDuration = totalQuestions * 10;
          console.log('timer');
          return interval(1000).pipe(
            takeUntil(this.actions$.pipe(ofType(QuizActions.finishQuiz))),
            map((timeElapsed) => timerDuration - timeElapsed),
            tap(() => console.log('time')),
            tap((remainingTime) => {
              console.log('time', timerDuration);
              if (remainingTime === 0) {
                console.log('time', remainingTime);
                this.store.dispatch(QuizActions.finishQuiz());
              }
              const minutes = Math.floor(remainingTime / 60);
              const seconds = remainingTime % 60;

              const formattedMinutes =
                minutes < 10 ? '0' + minutes : '' + minutes;
              const formattedSeconds =
                seconds < 10 ? '0' + seconds : '' + seconds;
              this.store.dispatch(
                QuizActions.updateTimer({
                  timer: `${formattedMinutes}:${formattedSeconds}`,
                })
              );
            })
          );
        })
      ),
    { dispatch: false }
  );

  loadTrivia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.submitForm),
      switchMap((action) =>
        this.quizService.getTrivia(action.formValue).pipe(
          tap(() => {
            console.log('Form submitted successfully');
            this.router.navigate(['/quizstart']);
          }),
          switchMap((quizQuestions) => [
            QuizApiActions.loadQuestionsSuccess({ quizQuestions }),
            QuizActions.startTimer(),
          ]),
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
      concatLatestFrom(() => this.store.select(selectCategories)),
      filter(([i, cat]) => !Object.keys(cat).length),
      tap(() => console.log('categories here')),
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
  restartQuiz$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizActions.restartQuiz),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );
}
