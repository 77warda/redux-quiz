import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { QuizComponent } from './quiz/quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromQuizApp from './+state/quiz-app.reducer';
import { QuizAppEffects } from './+state/quiz-app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, QuizComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    StoreModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(
      fromQuizApp.QUIZ_APP_FEATURE_KEY,
      fromQuizApp.quizAppReducer
    ),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forFeature([QuizAppEffects]),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
