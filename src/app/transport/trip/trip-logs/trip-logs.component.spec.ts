import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripLogsComponent } from './trip-logs.component';

describe('TripLogsComponent', () => {
  let component: TripLogsComponent;
  let fixture: ComponentFixture<TripLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
