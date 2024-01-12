import { Component, OnInit } from '@angular/core';
import { Question, Quiz } from './quiz.interface';
import { QuizReduxService } from '../quiz-redux.service';
import { Store, select } from '@ngrx/store';
import * as QuizActions from '../+state/quiz-app.actions';
import { quizAppReducer } from '../+state/quiz-app.reducer';
import { Observable, combineLatest, map, withLatestFrom } from 'rxjs';
import {
  selectCorrectAnswer,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectQuestions,
  selectTotalQuestions,
} from '../+state/quiz-app.selectors';

@Component({
  selector: 'quiz-app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  questions$!: Observable<Question[]>;
  currentQuestionIndex$: Observable<number | null>;
  totalQuestions$: Observable<number | null>;
  currentQuestion$!: Observable<Question | undefined>;
  correctAnswer$!: Observable<string>;
  isOptionSelected = false;
  quizText!: string;
  selectedOption: string | null = null;
  selectedOptionClass: string | null = null;
  correctAnswerClass: string | null = null;
  state: Quiz = {
    totalQuestions: 0,
    current_score: 0,
    total_score: 0,
    questions: [],
    options: [],
    currentQuestion: '',
    current_Question_Index: 0,
  };

  constructor(private triviaService: QuizReduxService, private store: Store) {
    this.questions$ = this.store.pipe(select(selectQuestions));
    this.currentQuestionIndex$ = this.store.pipe(
      select(selectCurrentQuestionIndex)
    );
    this.totalQuestions$ = this.store.pipe(select(selectTotalQuestions));
  }

  ngOnInit(): void {
    this.restartQuiz();
    this.store.dispatch(QuizActions.loadQuestions());
    this.currentQuestionIndex$ = this.store.pipe(
      select(selectCurrentQuestionIndex)
    );
    this.totalQuestions$ = this.store.pipe(select(selectTotalQuestions));
    this.currentQuestion$ = this.store.pipe(select(selectCurrentQuestion));
    this.totalQuestions$ = this.store.pipe(select(selectTotalQuestions));
    this.correctAnswer$ = this.store.pipe(select(selectCorrectAnswer));
    this.correctAnswer$.subscribe((correctAnswer) =>
      console.log('Correct Answer:', correctAnswer)
    );
  }

  restartQuiz() {
    // this.fetchTriviaQuestion();
    this.state.current_score = 0;
    this.isOptionSelected = false;
    this.selectedOption = null;
    this.selectedOptionClass = null;
    this.correctAnswerClass = null;
  }
  shuffleArray(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.6);
  }

  // fetchTriviaQuestion() {
  //   this.triviaService.getTriviaQuestion().subscribe((triviaResponse: any) => {
  //     if (triviaResponse) {
  //       const questions: Question[] = triviaResponse.map(
  //         (questionItem: any) => ({
  //           question: questionItem.question.text,
  //           options: this.shuffleArray([
  //             ...questionItem.incorrectAnswers,
  //             questionItem.correctAnswer,
  //           ]),
  //           correctAnswer: questionItem.correctAnswer,
  //         })
  //       );

  //       // Dispatch the loadQuestionsSuccess action with the correct payload
  //       this.store.dispatch(QuizActions.loadQuestionsSuccess({ questions }));

  //       this.state.totalQuestions = triviaResponse.length;
  //       this.state.total_score = triviaResponse.length;
  //       this.state.questions = questions;

  //       this.setCurrentQuestion(0);
  //     } else {
  //       console.error('Invalid response structure');
  //     }
  //   });
  // }

  setCurrentQuestion(index: number) {
    this.quizText = 'Redux Angular Quiz';
    this.state.current_Question_Index = index;
    this.state.currentQuestion = this.state?.questions[index]?.question;
    this.state.options = this.state?.questions[index]?.options;
  }

  nextQuestion() {
    const nextIndex = this.state.current_Question_Index + 1;

    // Dispatch the nextQuestion action
    this.store.dispatch(QuizActions.nextQuestion());
    this.setCurrentQuestion(nextIndex);

    // reset styling
    this.selectedOption = null;
    this.selectedOptionClass = null;
    this.correctAnswerClass = null;
    this.isOptionSelected = false;
  }
  isCorrectAnswer(option: string): boolean {
    let correctAnswer: string | undefined;

    // Use the NgRx store to get the current question and its correct answer
    this.store
      .pipe(select(selectCurrentQuestion))
      .subscribe((currentQuestion) => {
        if (currentQuestion) {
          correctAnswer = currentQuestion.correctAnswer;
        }
      });

    return !!correctAnswer && correctAnswer === option;
  }

  // Function to handle option selection
  selectOption(option: string) {
    if (!this.selectedOption) {
      this.selectedOption = option;
      const isCorrect = this.isCorrectAnswer(option);

      console.log('Selected option:', option);
      console.log('Is correct:', isCorrect);
      this.store.dispatch(QuizActions.selectOption({ option, isCorrect }));
      if (isCorrect) {
        this.state.current_score++;
      }

      this.selectedOptionClass = isCorrect
        ? 'correct-answer'
        : 'incorrect-answer';
      this.correctAnswerClass = 'correct-answer';
      this.isOptionSelected = true;
    }
  }
}
