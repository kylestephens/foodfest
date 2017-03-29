import { Component, Input }        from '@angular/core';
import { FormGroup, FormControl }  from '@angular/forms';
import { ValidationService }       from '../../services/validation.service';

@Component({
  selector: 'ak-form-messages',
  template: `
    <div *ngIf="getErrorMessage() !== null" style="color:maroon">
      {{ getErrorMessage() }}
    </div>
  `
})

export class FormMessagesComponent {

  errorMessage: string;

  @Input()
  control: FormControl;

  constructor() {}

  getErrorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  };

};
