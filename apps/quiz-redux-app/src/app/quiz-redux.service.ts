import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Quiz } from './quiz/quiz.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizReduxService {
  private apiUrl = 'https://the-trivia-api.com/v2/questions';

  constructor(private http: HttpClient) {}

  getTriviaQuestion(): Observable<Quiz> {
    return this.http.get<Quiz>(this.apiUrl).pipe(
      tap((response) => console.log('Trivia Question Response:', response)),
      catchError((error) => {
        console.error('Error fetching trivia question:', error);
        return throwError(error);
      })
    );
  }
}
