import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaperFormComponent } from './diaper-form-component';

describe('DiaperFormComponent', () => {
  let component: DiaperFormComponent;
  let fixture: ComponentFixture<DiaperFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaperFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiaperFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
