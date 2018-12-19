import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailedMarklistComponent } from './view-detailed-marklist.component';

describe('ViewDetailedMarklistComponent', () => {
  let component: ViewDetailedMarklistComponent;
  let fixture: ComponentFixture<ViewDetailedMarklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailedMarklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailedMarklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
