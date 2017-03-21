import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { CommercialModule } from './commercial.module';

export function main() {
   describe('Commercial component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
    });

    it('should work',
      async(() => {
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<ak-commercial></ak-commercial>'
})
class TestComponent {}
