/**
 * This is a class full of static methods to validate form controls
 *
 * As it is static, it doesn't need to be injectable and instantiated
 * in constructor. Instead, reference it directly and use as appropriate.
 */
export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config: any = {
      'required': 'This is a required field',
      'invalidCreditCard': 'Invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}`,
      'textInputError': 'Invalid character. Please use letters and numbers only',
      'alphaNumericError': 'Invalid character. Please use letters and numbers only',
      'phoneNumberError': 'Invalid format. Please use numbers only',
      'websiteError': 'Invalid website address'
    };

    return config[validatorName];
  };

  static textInputValidator(control: any) {
    // Letters, Numbers and Spaces and some accepted characters (, . ! @, etc.)
    if ( control.value === '' || control.value.match(/^(?:[A-Za-z0-9 \_\-\'\@\!\#\.\,]*)$/) ) {
      return null;
    } else {
      return { 'textInputError': true };
    }
  };

  static alphaNumericValidator(control: any) {
    // Letters, Numbers and Spaces
    if ( control.value === '' || control.value.match(/^(?:[A-Za-z0-9]+)(?:[A-Za-z0-9 _-]*)$/) ) {
      return null;
    } else {
      return { 'alphaNumericError': true };
    }
  };

  static websiteValidator(control: any) {
    // Website pattern
    if ( control.value === '' || control.value.match(
      /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    ) ) {
      return null;
    } else {
      return { 'websiteError': true };
    }
  };

  static phoneNumberValidator(control: any) {
    // Letters, Numbers and Spaces
    if ( control.value === null || control.value === '' || control.value.match(/^(?:[0-9(]+)(?:[0-9 ()_-]*)$/) ) {
      return null;
    } else {
      return { 'phoneNumberError': true };
    }
  };

  static creditCardValidator(control: any) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if ( control.value === '' || control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) ) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  };

  static emailValidator(control: any) {
    // RFC 2822 compliant regex
    if ( control.value === '' || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) ) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  };

  static passwordValidator(control: any) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if ( control.value === '' || control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/) ) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  };

  static checkRequiredArray(control: any) {
    //At least one element in array
    if(control.controls.length === 0) {
      return { 'required': true };
    }
    else {
      return null;
    }
  }

}
