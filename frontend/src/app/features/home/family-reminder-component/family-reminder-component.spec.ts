import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyReminderComponent } from './family-reminder-component';

describe('FamilyReminderComponent', () => {
  let component: FamilyReminderComponent;
  let fixture: ComponentFixture<FamilyReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyReminderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyReminderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
