/* tslint:disable:no-unused-variable */

import { TestBed,  inject } from '@angular/core/testing';
import { TokenStorageService } from './tokenStorage.service';

describe('Service: TokenStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenStorageService]
    });
  });

  it('should ...', inject([TokenStorageService], (service: TokenStorageService) => {
    expect(service).toBeTruthy();
  }));
});
