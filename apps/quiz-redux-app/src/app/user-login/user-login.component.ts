import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizReduxService } from '../quiz-redux.service';
import { QuizActions } from '../+state/quiz-app.actions';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Categories } from '../quiz/quiz.interface';
import {
  selectCategories,
  selectTotalQuestions,
} from '../+state/quiz-app.selectors';

@Component({
  selector: 'quiz-app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  quizLoginForm!: FormGroup;
  categories$!: Observable<Categories>;
  totalQuestions$!: Observable<number>;
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.dispatch(QuizActions.loadCategories());

    // this.totalQuestions$ = this.store.select(selectTotalQuestions);
    this.categories$ = this.store.select(selectCategories);
    // this.store.dispatch(QuizActions.loadCategories());
    this.quizLoginForm = this.fb.group({
      username: ['', [Validators.required]],
      numberOfQuestions: [0, [Validators.required, Validators.min(1)]],
      difficulty: ['', [Validators.required]],
      category: [[], [Validators.required]],
    });
  }

  onSubmit(formValue: any) {
    // const selectedNumberOfQuestions =
    //   this.quizLoginForm.get('numberOfQuestions')?.value;
    // const selectedCategory = this.quizLoginForm.get('category')?.value;
    // const selectedDifficulty = this.quizLoginForm.get('difficulty')?.value;

    // this.store.dispatch(
    //   QuizActions.setSelectedNumberOfQuestions({ selectedNumberOfQuestions })
    // );
    // this.store.dispatch(QuizActions.setSelectedCategory({ selectedCategory }));
    // this.store.dispatch(
    //   QuizActions.setSelectedDifficulty({ selectedDifficulty })
    // );

    console.log('form submit', this.quizLoginForm.value);
    this.store.dispatch(
      QuizActions.submitForm({ formValue: this.quizLoginForm.value })
    );
    this.quizLoginForm.reset();
    this.router.navigate(['/quizstart']);
  }
}
