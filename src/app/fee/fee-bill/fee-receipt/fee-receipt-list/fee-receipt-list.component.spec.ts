import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeReceiptListComponent } from './fee-receipt-list.component';

describe('FeeReceiptListComponent', () => {
  let component: FeeReceiptListComponent;
  let fixture: ComponentFixture<FeeReceiptListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeReceiptListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
