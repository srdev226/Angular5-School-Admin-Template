import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentMarkListComponent } from './view-student-marklist.component';

describe('ViewStudentMarkListComponent', () => {
  let component: ViewStudentMarkListComponent;
  let fixture: ComponentFixture<ViewStudentMarkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStudentMarkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentMarkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
