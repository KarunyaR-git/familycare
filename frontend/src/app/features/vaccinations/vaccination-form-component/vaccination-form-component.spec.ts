import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationFormComponent } from './vaccination-form-component';

describe('VaccinationFormComponent', () => {
  let component: VaccinationFormComponent;
  let fixture: ComponentFixture<VaccinationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccinationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VaccinationFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
