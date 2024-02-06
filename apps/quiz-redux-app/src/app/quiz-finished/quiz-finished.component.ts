import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { QuizActions } from '../+state/quiz-app.actions';
import { Router } from '@angular/router';

import {
  // selectCurrentScore,
  selectTotalQuestions,
} from '../+state/quiz-app.selectors';

@Component({
  selector: 'quiz-app-quiz-finished',
  templateUrl: './quiz-finished.component.html',
  styleUrls: ['./quiz-finished.component.scss'],
})
export class QuizFinishedComponent implements OnInit {
  currentScore$!: Observable<number>;
  totalQuestions$!: Observable<number>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    // this.currentScore$ = this.store.pipe(select(selectCurrentScore));
    this.totalQuestions$ = this.store.pipe(select(selectTotalQuestions));
  }

  restartQuiz() {
    // Dispatch an action to reset the quiz state
    this.store.dispatch(QuizActions.restartQuiz());
    this.router.navigate(['/']);
    // Optionally, you can navigate to the quiz component or any other component
    // depending on your application flow.
    // For example, if you have a route for the quiz component:
    // this.router.navigate(['/quiz']);
  }
}
