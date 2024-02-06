import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizFinishedComponent } from './quiz-finished.component';

describe('QuizFinishedComponent', () => {
  let component: QuizFinishedComponent;
  let fixture: ComponentFixture<QuizFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizFinishedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
