import { TestBed } from '@angular/core/testing';

import { Tecnologia } from './tecnologia';

describe('Tecnologia', () => {
  let service: Tecnologia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tecnologia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
