import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeBillListComponent } from './fee-bill-list.component';

describe('FeeBillListComponent', () => {
  let component: FeeBillListComponent;
  let fixture: ComponentFixture<FeeBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeBillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
