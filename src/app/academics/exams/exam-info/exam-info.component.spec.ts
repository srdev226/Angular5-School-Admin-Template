import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInfoComponent } from './exam-info.component';

describe('ExamInfoComponent', () => {
  let component: ExamInfoComponent;
  let fixture: ComponentFixture<ExamInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
