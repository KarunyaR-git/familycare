import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyReportComponent } from './baby-report-component';

describe('BabyReportComponent', () => {
  let component: BabyReportComponent;
  let fixture: ComponentFixture<BabyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BabyReportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
