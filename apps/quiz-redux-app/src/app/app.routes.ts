import { Route } from '@angular/router';
import { QuizFinishedComponent } from './quiz-finished/quiz-finished.component';
import { QuizComponent } from './quiz/quiz.component';
import { SkipQuizComponent } from './skip-quiz/skip-quiz.component';
import { UserLoginComponent } from './user-login/user-login.component';

export const appRoutes: Route[] = [
  { path: '', component: UserLoginComponent },
  { path: 'quizstart', component: QuizComponent },
  { path: 'result', component: QuizFinishedComponent },
  { path: 'skip', component: SkipQuizComponent },
];
