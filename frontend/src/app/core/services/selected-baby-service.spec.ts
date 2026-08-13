import { TestBed } from '@angular/core/testing';

import { SelectedBabyService } from './selected-baby-service';

describe('SelectedBabyService', () => {
  let service: SelectedBabyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedBabyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
