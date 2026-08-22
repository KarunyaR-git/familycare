import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepFormComponent } from './sleep-form-component';

describe('SleepFormComponent', () => {
  let component: SleepFormComponent;
  let fixture: ComponentFixture<SleepFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SleepFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SleepFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
