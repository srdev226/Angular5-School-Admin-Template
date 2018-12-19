import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRuleInfoComponent } from './fee-rule-info.component';

describe('FeeRuleInfoComponent', () => {
  let component: FeeRuleInfoComponent;
  let fixture: ComponentFixture<FeeRuleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeRuleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeRuleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
