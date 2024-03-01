import { Component, OnInit } from '@angular/core';
import { Quiz } from './quiz.interface';
import { Store } from '@ngrx/store';
import { QuizActions } from '../+state/quiz-app.actions';
import { Observable } from 'rxjs';
import {
  selectCompleteQuiz,
  selectOptionWindowVisible,
  selectSideWindowVisible,
} from '../+state/quiz-app.selectors';

@Component({
  selector: 'quiz-app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  constructor(private store: Store<Quiz>) {}

  currentQuestionNumber$!: Observable<number>;
  isOptionSelected = false;
  // optionWindowVisible = false;
  // sideWindowVisible = false;
  completeQuiz$!: Observable<any>;
  // sideWindowVisible$!: Observable<boolean>;
  // optionWindowVisible$!: Observable<boolean>;

  ngOnInit(): void {
    this.store.dispatch(QuizActions.loadQuizQuestions());
    this.store.dispatch(QuizActions.startTimer());
    this.completeQuiz$ = this.store.select(selectCompleteQuiz);
    // this.sideWindowVisible$ = this.store.select(selectSideWindowVisible);
    // this.optionWindowVisible$ = this.store.select(selectOptionWindowVisible);
    // this.optionWindowVisible$.subscribe((completeQuiz) => {
    //   console.log('side:', completeQuiz);
    // });
  }

  openSideWindow() {
    this.store.dispatch(QuizActions.openSideWindow());
  }

  closeSideWindow() {
    this.store.dispatch(QuizActions.closeSideWindow());
  }

  toggleOptionWindow() {
    this.store.dispatch(QuizActions.toggleOptionWindow());
  }

  setCurrentQuestion(index: number) {
    this.store.dispatch(
      QuizActions.setCurrentQuestion({ currentQuestionNumber: index + 1 })
    );
  }

  nextQuestion(): void {
    this.store.dispatch(QuizActions.nextQuestion());
    this.isOptionSelected = false;
  }

  skipQuestion() {
    this.store.dispatch(QuizActions.skipQuestion());
  }

  handleOption(selectedOption: string) {
    this.store.dispatch(QuizActions.selectedOption({ selectedOption }));
    this.isOptionSelected = true;
  }
  previousQuestion() {
    this.store.dispatch(QuizActions.previousQuestion());
  }
  finishQuiz() {
    this.store.dispatch(QuizActions.finishQuiz());
  }
}
