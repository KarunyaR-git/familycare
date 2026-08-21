import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyFormComponent } from './baby-form-component';

describe('BabyFormComponent', () => {
  let component: BabyFormComponent;
  let fixture: ComponentFixture<BabyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BabyFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
