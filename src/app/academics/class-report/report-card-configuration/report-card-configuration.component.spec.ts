import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardConfigurationComponent } from './report-card-configuration.component';

describe('ReportCardConfigurationComponent', () => {
  let component: ReportCardConfigurationComponent;
  let fixture: ComponentFixture<ReportCardConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCardConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
