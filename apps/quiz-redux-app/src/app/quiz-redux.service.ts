import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Categories, Question, Quiz } from './quiz/quiz.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizReduxService {
  // private apiUrl = 'https://the-trivia-api.com/v2/questions';
  // private apiCatUrl = ' https://the-trivia-api.com/v2/categories';

  // constructor(private http: HttpClient) {}

  // getTriviaQuestion(): Observable<Question> {
  //   return this.http.get<Question>(this.apiUrl).pipe(
  //     tap((data) => {
  //       console.log('questions:', data);
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching trivia question:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  // getcategories(): Observable<any> {
  //   return this.http.get<any>(this.apiCatUrl).pipe(
  //     // tap((data) => {
  //     //   console.log('Categories:', data);
  //     // }),
  //     catchError((error) => {
  //       console.error('Error fetching trivia question:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  private apiUrl = 'https://the-trivia-api.com/v2/';
  constructor(private http: HttpClient) {}
  getCategories(): Observable<Categories> {
    return this.http.get<Categories>(`${this.apiUrl}categories`);
  }
  getTrivia(formValue: any): Observable<Question[]> {
    let searchParams = new HttpParams();
    const categories = formValue.category;
    const difficulties = formValue.difficulty;
    const totalQuestions = formValue.numberOfQuestions;

    if (categories) {
      searchParams = searchParams.append('categories', categories);
    }
    if (difficulties) {
      searchParams = searchParams.append('difficulties', difficulties);
    }

    if (totalQuestions) {
      searchParams = searchParams.append('limit', totalQuestions.toString());
    }
    return this.http.get<Question[]>(
      'https://the-trivia-api.com/v2/questions',
      {
        params: searchParams,
      }
    );
  }
}
