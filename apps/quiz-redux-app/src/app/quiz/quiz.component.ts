import { Component, OnInit } from '@angular/core';
import { Question, Quiz } from './quiz.interface';
import { Store, select } from '@ngrx/store';
import { QuizActions } from '../+state/quiz-app.actions';
import { Observable, Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import {
  selectCompleteQuiz,
  selectTimer,
  selectTotalQuestions,
} from '../+state/quiz-app.selectors';
import { QuizReduxService } from '../quiz-redux.service';

@Component({
  selector: 'quiz-app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  constructor(
    private store: Store<Quiz>,
    private router: Router,
    private quizService: QuizReduxService
  ) {}

  quizStarted = false;
  currentQuestionNumber$!: Observable<number>;
  isOptionSelected = false;
  optionWindowVisible = false;
  sideWindowVisible = false;
  quizQuestions$!: Observable<Quiz>;
  selectCurrentQuestion$!: Observable<Question>;
  totalQuestions$!: Observable<number>;
  completeQuiz$!: Observable<any>;
  // nextBtn = 'Next';
  // set timer
  uiTimer$!: Observable<string>;
  uiTimer: any;
  startTime: any;
  totalQuestions = 0;
  timerSubscription!: Subscription;
  timerDuration = 0;

  ngOnInit(): void {
    this.store.dispatch(QuizActions.loadQuizQuestions());
    this.store.dispatch(QuizActions.startTimer());

    // this.selectCurrentQuestion$ = this.store.pipe(
    //   select(selectCurrentQuestion)
    // );
    // this.quizQuestions$ = this.store.select(selectQuizState);
    // this.currentQuestionNumber$ = this.store.pipe(
    //   select(selectCurrentQuestionNumber)
    // );
    // this.totalQuestions$ = this.store.select(selectTotalQuestions);
    this.uiTimer$ = this.store.select(selectTimer);
    this.completeQuiz$ = this.store.select(selectCompleteQuiz);
    // this.totalQuestions$.subscribe((totalQuestions: number) => {
    //   this.totalQuestions = totalQuestions;
    //   this.timerDuration = this.calculateTimerDuration();
    //   this.startTimer();
    // });
  }

  // calculateTimerDuration(): number {
  //   return this.totalQuestions * 10;
  // }

  // startTimer(): void {
  //   setTimeout(() => {
  //     let timer = this.timerDuration;

  //     this.timerSubscription = interval(1000).subscribe(() => {
  //       if (timer >= 0) {
  //         const minutes = Math.floor(timer / 60);
  //         const seconds = timer % 60;

  //         const formattedMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
  //         const formattedSeconds = seconds < 10 ? '0' + seconds : '' + seconds;

  //         this.uiTimer = `${formattedMinutes}:${formattedSeconds}`;

  //         if (timer === 0) {
  //           this.router.navigate(['/result']);
  //           this.timerSubscription.unsubscribe();
  //         }
  //         timer--;
  //       }
  //     });
  //   }, 500);
  // }

  openSideWindow() {
    this.sideWindowVisible = true;
    this.optionWindowVisible = false;
  }
  closeSideWindow() {
    this.sideWindowVisible = false;
  }
  toggleOptionWindow() {
    this.optionWindowVisible = !this.optionWindowVisible;
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
