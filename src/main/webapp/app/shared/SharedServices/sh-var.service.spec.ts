import { TestBed } from '@angular/core/testing';

import { ShVarService } from './sh-var.service';

describe('ShVarService', () => {
  let service: ShVarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShVarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
