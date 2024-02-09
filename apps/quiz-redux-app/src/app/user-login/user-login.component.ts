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
  constructor(private store: Store, private fb: FormBuilder) {}

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
    const selectedCategories = this.quizLoginForm
      .get('category')
      ?.value.map((category: any) => category.$ngOptionLabel);
    console.log('Selected categories:', selectedCategories);

    const formDataWithCategories = {
      ...formValue,
      category: selectedCategories,
    };

    console.log('Form submit with categories:', formDataWithCategories);

    this.store.dispatch(
      QuizActions.submitForm({ formValue: formDataWithCategories })
    );

    this.quizLoginForm.reset();
  }
}
