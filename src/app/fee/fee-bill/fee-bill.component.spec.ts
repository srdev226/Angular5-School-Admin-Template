import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeBillComponent } from './fee-bill.component';

describe('FeeBillComponent', () => {
  let component: FeeBillComponent;
  let fixture: ComponentFixture<FeeBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
