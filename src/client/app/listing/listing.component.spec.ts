import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { ListingModule } from './listing.module';

export function main() {
   describe('Listing component', () => {
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
  template: '<ak-listing></ak-listing>'
})
class TestComponent {}
