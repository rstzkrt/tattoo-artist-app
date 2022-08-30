import { TestBed } from '@angular/core/testing';

import { TattooWorkService } from './tattoo-work.service';

describe('TattooWorkService', () => {
  let service: TattooWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TattooWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
