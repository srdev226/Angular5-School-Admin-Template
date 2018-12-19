import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPrintComponent } from './student-print.component';

describe('StudentPrintComponent', () => {
  let component: StudentPrintComponent;
  let fixture: ComponentFixture<StudentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
