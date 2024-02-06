import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { QuizActions } from '../+state/quiz-app.actions';

@Component({
  selector: 'quiz-app-skip-quiz',
  templateUrl: './skip-quiz.component.html',
  styleUrls: ['./skip-quiz.component.scss'],
})
export class SkipQuizComponent {
  constructor(private store: Store, private router: Router) {}
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
