import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabySummaryComponent } from './baby-summary-component';

describe('BabySummaryComponent', () => {
  let component: BabySummaryComponent;
  let fixture: ComponentFixture<BabySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabySummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BabySummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
