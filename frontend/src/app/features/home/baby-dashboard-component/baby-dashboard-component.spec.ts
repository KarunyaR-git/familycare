import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyDashboardComponent } from './baby-dashboard-component';

describe('BabyDashboardComponent', () => {
  let component: BabyDashboardComponent;
  let fixture: ComponentFixture<BabyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BabyDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
