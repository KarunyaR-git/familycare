import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthFormComponent } from './growth-form-component';

describe('GrowthFormComponent', () => {
  let component: GrowthFormComponent;
  let fixture: ComponentFixture<GrowthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrowthFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrowthFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
