import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelersComponent } from './travelers.component';

describe('TravelersComponent', () => {
  let component: TravelersComponent;
  let fixture: ComponentFixture<TravelersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
