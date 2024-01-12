import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, map, mergeMap, tap } from 'rxjs';
import * as QuizAppActions from './quiz-app.actions';
import * as QuizAppFeature from './quiz-app.reducer';
import { QuizReduxService } from '../quiz-redux.service';
import { Question } from '../quiz/quiz.interface';

@Injectable()
export class QuizAppEffects {
  constructor(
    private actions$: Actions,
    private triviaService: QuizReduxService // Inject your trivia service
  ) {}

  loadQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizAppActions.loadQuestions),
      tap(() => console.log('Fetching trivia questions...')),
      switchMap(() =>
        this.triviaService.getTriviaQuestion().pipe(
          map((triviaResponse: any) => {
            console.log(
              'Trivia questions received from Effects:',
              triviaResponse
            );

            if (triviaResponse) {
              const questions: Question[] = triviaResponse.map(
                (questionItem: any) => ({
                  question: questionItem.question.text,
                  options: this.shuffleArray([
                    ...questionItem.incorrectAnswers,
                    questionItem.correctAnswer,
                  ]),
                  correctAnswer: questionItem.correctAnswer,
                })
              );

              // Dispatch the loadQuestionsSuccess action with the correct payload
              return QuizAppActions.loadQuestionsSuccess({ questions });
            } else {
              console.error('Invalid response structure');
              return QuizAppActions.loadQuestionsFailure({
                error: 'Invalid response structure',
              });
            }
          }),
          catchError((error) =>
            of(QuizAppActions.loadQuestionsFailure({ error }))
          )
        )
      )
    )
  );

  shuffleArray(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.6);
  }
}
