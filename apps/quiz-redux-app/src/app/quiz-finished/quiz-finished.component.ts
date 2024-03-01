import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuizActions } from '../+state/quiz-app.actions';
import { Router } from '@angular/router';
import { selectFinishQuiz } from '../+state/quiz-app.selectors';
import { Question } from '../quiz/quiz.interface';

@Component({
  selector: 'quiz-app-quiz-finished',
  templateUrl: './quiz-finished.component.html',
  styleUrls: ['./quiz-finished.component.scss'],
})
export class QuizFinishedComponent implements OnInit {
  finishQuiz$!: Observable<any>;
  questions!: Question[];

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.finishQuiz$ = this.store.select(selectFinishQuiz);
  }

  restartQuiz() {
    this.store.dispatch(QuizActions.restartQuiz());
  }
}
