import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                          from '@angular/forms';
import {
  LocalStorageService
}                                          from 'ng2-webstorage';
import { CreateListingService }            from '../../create-listing.service';
import { ValidationService }               from '../../../services/validation.service';
import { CONSTANT }                        from '../../../core/constant';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-four',
  templateUrl: 'create-listing-step-four.component.html'
})

export class CreateListingStepFourComponent {

  public stepFourForm: FormArray;
  public itemType: string = 'Menu';
  public itemTitleExample: string = 'Pizza Margherita';
  public itemDescriptionExample: string = 'Fresh Basil, Cubed Italian mozzarella, Grated parmesan';

  // Chiavari Chair
  // Our Chiavari chairs in lime wash have classic style and are our most popular chair for weddings and formal events.  These chairs are supplied with a seat pad and are stackable.

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService,
    private validationService: ValidationService
  ) {
    this.stepFourForm = this.fb.array([
      this._initItem()
    ]);
  };

  ngOnInit() {
    var _formValues;
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR)) {
      // user might be returning from next step
      // restore values to fields to allow them to edit their data
      _formValues = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR);
      this._restoreFormValues(_formValues);
    }
    let stepOne = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
    );
    for(var i = 0; i < stepOne.businessType.length; i++) {
      if(stepOne.businessType[i].text === 'artisan food') {
        this.itemType = 'Product';
        this.itemTitleExample = 'Raspberry Jam';
        this.itemDescriptionExample = `
          Our raspberries have the best flavour and colour and are grown
          to an amazing size allowing their flavours to develop.
          This jam is fantastic on scones, homemade brown bread and in all
          desserts.
        `.replace(/\s+/g, " ");
      } else if(stepOne.businessType[i].text === 'equipment hire') {
        this.itemType = 'Item';
        this.itemTitleExample = 'Chiavari Chair';
        this.itemDescriptionExample = `
          Our Chiavari chairs in lime wash have classic style and are
          our most popular chair for weddings and formal events.
          These chairs are supplied with a seat pad and are stackable.
        `.replace(/\s+/g, " ");
      }
    }

  };

  public submitForm(value: any) {
    let count = this.stepFourForm.controls.length;
    if(this.stepFourForm.controls[count - 1].get('item_description').value !== '' &&
        this.stepFourForm.controls[count - 1].get('item_title').value ==='') {
      this.stepFourForm.controls[count - 1].get('item_title').markAsTouched();
    } else {
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR,
        value
      );
      this._nextStep();
    }
  };

  public onClickAddItem() {
    let count = this.stepFourForm.controls.length;
    if(this.stepFourForm.controls[count - 1].get('item_title').value == '') {
      this.stepFourForm.controls[count - 1].get('item_title').markAsTouched();
    } else {
      this.stepFourForm.push(
        this._initItem()
      );
    }
  };

  public previousStep() {
    this.createListingService.previousStep();
  };

  private _nextStep() {
    this.createListingService.nextStep();
  };

  private _initItem(value?: any) {
    return this.fb.group({
      item_title: new FormControl('', [
        Validators.required
      ]),
      item_description: new FormControl('', [])
    });
  };

  private _restoreFormValues(values: any) {
    for(var i = 0; i < values.length; i++) {
      this.stepFourForm.push(
        this.fb.group({
          item_title: new FormControl(values[i].item_title, [
            Validators.required
          ]),
          item_description: new FormControl(values[i].item_description, [])
        })
      );
    }
    this.stepFourForm.removeAt(0);
  };

};
