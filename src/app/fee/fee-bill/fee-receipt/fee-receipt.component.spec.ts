import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeReceiptComponent } from './fee-receipt.component';

describe('FeeReceiptComponent', () => {
  let component: FeeReceiptComponent;
  let fixture: ComponentFixture<FeeReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
