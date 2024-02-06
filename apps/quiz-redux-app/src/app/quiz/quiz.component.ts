import { Component, OnInit } from '@angular/core';
import { Question, Quiz } from './quiz.interface';
import { Store, select } from '@ngrx/store';
import { QuizActions } from '../+state/quiz-app.actions';
import { Observable, Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import {
  selectCurrentQuestion,
  selectCurrentQuestionNumber,
  selectQuizState,
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
  // nextBtn = 'Next';
  // set timer
  uiTimer: any;
  startTime: any;
  totalQuestions = 0;
  timerSubscription!: Subscription;
  timerDuration = 0;

  ngOnInit(): void {
    this.store.dispatch(QuizActions.loadQuizQuestions());
    this.selectCurrentQuestion$ = this.store.pipe(
      select(selectCurrentQuestion)
    );
    this.quizQuestions$ = this.store.select(selectQuizState);
    this.currentQuestionNumber$ = this.store.pipe(
      select(selectCurrentQuestionNumber)
    );
    this.totalQuestions$ = this.store.select(selectTotalQuestions);

    this.totalQuestions$.subscribe((totalQuestions: number) => {
      this.totalQuestions = totalQuestions;
      this.timerDuration = this.calculateTimerDuration();
      this.startTimer();
    });
  }

  calculateTimerDuration(): number {
    return this.totalQuestions * 10;
  }
  startTimer(): void {
    let timer = this.timerDuration;

    this.timerSubscription = interval(1000).subscribe(() => {
      if (timer >= 0) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        const formattedMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : '' + seconds;

        this.uiTimer = `${formattedMinutes}:${formattedSeconds}`;
        timer--;
      }
    });
  }

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

  // againLoadQuestions() {
  //   this.store.dispatch(QuizActions.loadQuizQuestions());
  // }

  nextQuestion(): void {
    this.store.dispatch(QuizActions.nextQuestion());
    this.isOptionSelected = false;
    this.currentQuestionNumber$.subscribe((currentQuestionNumber) => {
      console.log('current in next', currentQuestionNumber - 1);
      console.log('total ques', this.totalQuestions);
      if (this.totalQuestions == currentQuestionNumber) {
        this.router.navigate(['/result']);
      }
    });
  }

  skipQuestion() {
    this.store.dispatch(QuizActions.skipQuestion());
  }

  handleOption(selectedOption: string) {
    this.store.dispatch(QuizActions.selectedOption({ selectedOption }));
    this.isOptionSelected = true;
  }

  // Restart quiz method
  // restartQuiz() {
  //   this.againLoadQuestions();
  //   this.store.dispatch(QuizActions.restartQuiz());
  // }
  previousQuestion() {
    this.store.dispatch(QuizActions.previousQuestion());
  }
}
