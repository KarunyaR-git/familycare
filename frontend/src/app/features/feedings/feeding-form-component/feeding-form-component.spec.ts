import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingFormComponent } from './feeding-form-component';

describe('FeedingFormComponent', () => {
  let component: FeedingFormComponent;
  let fixture: ComponentFixture<FeedingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedingFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedingFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
