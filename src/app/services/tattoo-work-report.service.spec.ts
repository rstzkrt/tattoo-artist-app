import { TestBed } from '@angular/core/testing';

import { TattooWorkReportService } from './tattoo-work-report.service';

describe('TattooWorkReportService', () => {
  let service: TattooWorkReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TattooWorkReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
