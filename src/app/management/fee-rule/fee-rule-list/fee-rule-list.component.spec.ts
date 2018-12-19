import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRuleListComponent } from './fee-rule-list.component';

describe('FeeRuleListComponent', () => {
  let component: FeeRuleListComponent;
  let fixture: ComponentFixture<FeeRuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeRuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
