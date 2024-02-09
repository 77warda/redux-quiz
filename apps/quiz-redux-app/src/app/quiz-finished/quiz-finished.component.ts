import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuizActions } from '../+state/quiz-app.actions';
import { Router } from '@angular/router';
import { selectCompleteQuiz } from '../+state/quiz-app.selectors';

@Component({
  selector: 'quiz-app-quiz-finished',
  templateUrl: './quiz-finished.component.html',
  styleUrls: ['./quiz-finished.component.scss'],
})
export class QuizFinishedComponent implements OnInit {
  // currentScore$!: Observable<number>;
  // totalQuestions$!: Observable<number>;
  completeQuiz$!: Observable<any>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    // this.currentScore$ = this.store.pipe(select(selectCurrentScore));
    // this.totalQuestions$ = this.store.pipe(select(selectTotalQuestions));
    this.completeQuiz$ = this.store.select(selectCompleteQuiz);
    // this.completeQuiz$.subscribe((completeQuiz) => {
    //   console.log('Complete quiz:', completeQuiz);
    // });
  }

  restartQuiz() {
    // Dispatch an action to reset the quiz state
    this.store.dispatch(QuizActions.restartQuiz());
    this.router.navigate(['/']);
  }
}
