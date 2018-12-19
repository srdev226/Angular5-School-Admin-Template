import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionInfoComponent } from './institution-info.component';

describe('InstitutionInfoComponent', () => {
  let component: InstitutionInfoComponent;
  let fixture: ComponentFixture<InstitutionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
