import { TestBed } from '@angular/core/testing';

import { AuthentServiceService } from './authent-service.service';

describe('AuthentServiceService', () => {
  let service: AuthentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
