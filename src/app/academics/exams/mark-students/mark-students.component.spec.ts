import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkStudentsComponent } from './mark-students.component';

describe('MarkStudentsComponent', () => {
  let component: MarkStudentsComponent;
  let fixture: ComponentFixture<MarkStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
