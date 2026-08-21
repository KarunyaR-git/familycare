import { TestBed } from '@angular/core/testing';

import { DiaperService } from './diaper-service';

describe('DiaperService', () => {
  let service: DiaperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
