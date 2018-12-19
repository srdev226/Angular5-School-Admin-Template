import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoEnrollComponent } from './auto-enroll.component';

describe('AutoEnrollComponent', () => {
  let component: AutoEnrollComponent;
  let fixture: ComponentFixture<AutoEnrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoEnrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
