import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkipQuizComponent } from './skip-quiz.component';

describe('SkipQuizComponent', () => {
  let component: SkipQuizComponent;
  let fixture: ComponentFixture<SkipQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkipQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
