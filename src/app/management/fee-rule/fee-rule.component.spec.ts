import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRuleComponent } from './fee-rule.component';

describe('FeeRuleComponent', () => {
  let component: FeeRuleComponent;
  let fixture: ComponentFixture<FeeRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
