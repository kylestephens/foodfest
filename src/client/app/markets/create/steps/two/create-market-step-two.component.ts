import { Component,
         ElementRef,
         NgZone,
         OnInit,
         ViewChild }             from '@angular/core';
import { FormArray,
         FormBuilder,
         FormControl,
         FormGroup,
         Validators }          from '@angular/forms';
import { Router }              from '@angular/router';
import { AgmCoreModule }       from 'angular2-google-maps/core/core-module';
import { MapsAPILoader }       from 'angular2-google-maps/core/services';
import { CONSTANT }            from '../../../../core/constant';
import { CreateMarketService } from '../../create-market.service';
import { ValidationService }   from '../../../../services/validation.service';
import { MessagingService }    from '../../../../services/messaging.service';
import { LoaderService }       from '../../../../services/loader.service';

declare var google: any;

@Component({
  moduleId: module.id,
  selector: 'ak-create-market-step-two',
  templateUrl: 'create-market-step-two.component.html',
  styleUrls: ['../one/create-market-step-one.component.css']
})

export class CreateMarketStepTwoComponent implements OnInit {

  @ViewChild('autocompleteSearchOrganisation')
  public searchOrganisationElementRef: ElementRef;

  public createMarketForm: FormGroup;

  private googleApiOptions = { componentRestrictions: {country: 'ie'} };
  private organisationAutoCompleteInit: boolean = false;
  private organisationAddress: string;
  private organisationId: number;

  constructor (
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private createMarketService: CreateMarketService,
    private router: Router,
    private messagingService: MessagingService,
    private loaderService: LoaderService
    )
  {
    this.createMarketForm = this.fb.group({
      'allowContact': new FormControl(false),
      'isOrganisation': new FormControl(false),
      'organisation': this.fb.group(this._initEmptyOrganisationForm())
    });

    this._subscribeIsOrganisationChanges();
  }

  ngOnInit() {
    if(this.createMarketService.getStoredMarket().secondStep) {
      this._restoreFormValues(this.createMarketService.getStoredMarket().secondStep);
    }
    this._getUserOrganisation();
  }

  ngAfterViewInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load();
  }

  ngOnDestroy() {
    let isOrganisationControl = (<any>this.createMarketForm).controls.isOrganisation;
    isOrganisationControl.valueChanges.unsubscribe();
  }

  ngAfterContentChecked() {
    if(this.createMarketForm.controls.isOrganisation.value && this.searchOrganisationElementRef && !this.organisationAutoCompleteInit) {
      this._setOrganisationAutocomplete();
    }
  }

  previousStep() {
    this.createMarketService.previousStep();
  };

  submitForm(value: any) {
    if(this.createMarketForm.valid) {
      if(value.isOrganisation) this._checkOrganisationAddress();
      this._createMarket(value);
    }
    else {
      for (let i in this.createMarketForm.controls) {
        this.createMarketForm.controls[i].markAsTouched();

        let childControls = (<FormGroup>this.createMarketForm.controls[i]).controls;
        if(childControls) {
          for (let j in childControls) {
            childControls[j].markAsTouched();
          }
        }
      }
    }
  }

  private _getUserOrganisation() {
    this.createMarketService.getUserOrganisation().then(organisation => {
      if(organisation) this._setOrganisationValues(organisation);
    });

  }

  private _initEmptyOrganisationForm() {
    let organisation = {
      'organisationName': new FormControl(null),
      'organisationPhoneNumber': new FormControl(null),
      'organisationAddress': new FormControl(null),
      'organisationWebsite': new FormControl(null),
      'organisationDescription': new FormControl(null)
    };

    return organisation;
  }

  private _initOrganisationForm(): any {
    let organisation = {
      'organisationName': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(100)])),
      'organisationPhoneNumber': new FormControl(null, [ValidationService.phoneNumberValidator]),
      'organisationAddress': [null, [Validators.maxLength(300)]],
      'organisationWebsite': new FormControl(null, [Validators.maxLength(100)]),
      'organisationDescription': new FormControl(null, [Validators.maxLength(500)])
    };

    return organisation;
  }

  private _setOrganisationAutocomplete() {
    this.organisationAutoCompleteInit = true;
    let autocomplete = new google.maps.places.Autocomplete(this.searchOrganisationElementRef.nativeElement, this.googleApiOptions);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        let place = google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        (<FormGroup> this.createMarketForm.controls['organisation']).controls['organisationAddress'].setValue(
          this.searchOrganisationElementRef.nativeElement.value
        );
        this.organisationAddress = this.searchOrganisationElementRef.nativeElement.value;
      });
    });
  }

  private _subscribeIsOrganisationChanges() {
    let isOrganisationControl = (<any>this.createMarketForm).controls.isOrganisation,
        organisationControl = (<any>this.createMarketForm).controls.organisation;

    // subscribe to the stream
    isOrganisationControl.valueChanges.subscribe((isOrganisation: boolean) => {
      this.organisationAddress = null;
      if (isOrganisation) {
        Object.keys(organisationControl.controls).forEach(key => {
          organisationControl.controls[key].setValidators(this._initOrganisationForm()[key].validator);
          organisationControl.controls[key].updateValueAndValidity();
        });
      }
      else {
        Object.keys(organisationControl.controls).forEach(key => {
          organisationControl.controls[key].setValidators(null);
          organisationControl.controls[key].updateValueAndValidity();
        });
      }
    });
  }

  private _checkOrganisationAddress() {
    let submittedOrgAddress: string = (<FormGroup> this.createMarketForm.controls['organisation']).controls['organisationAddress'].value;

    if(this.organisationAddress !== submittedOrgAddress){
      (<FormGroup> this.createMarketForm.controls['organisation']).controls['organisationAddress'].setValue(
        this.searchOrganisationElementRef.nativeElement.value
      );
    }
    return;
  }

  private _restoreFormValues(values: any) {
    if(values.allowContact) {
      this.createMarketForm.controls['allowContact'].setValue(values.allowContact);
    }
    if(values.isOrganisation) {
      this.createMarketForm.controls['isOrganisation'].setValue(values.isOrganisation);
    }
    if(values.organisation) {
      this.createMarketForm.controls['organisation'].setValue(values.organisation);
    }
  }

  private _setOrganisationValues(organisation: any) {
    this.organisationId = organisation.id;
    this.createMarketForm.controls['isOrganisation'].setValue(true);
    let orgValues = {
      'organisationName': organisation.name,
      'organisationPhoneNumber': organisation.phone_num,
      'organisationAddress': organisation.address,
      'organisationWebsite': organisation.business_website,
      'organisationDescription': organisation.description

    }
    this.createMarketForm.controls['organisation'].setValue(orgValues);
  }

  private _createMarket(value: any) {
    this.loaderService.show();
    value.organisationId = this.organisationId;
    this.createMarketService.setStoredMarket(value, 2);
    this.createMarketService.createMarket()
    .then((marketId: number) => {
      this.loaderService.hide();
      this.router.navigate(['complete', 'market']);
    })
    .catch((reason: any) => {
      this.messagingService.show(
        'create-market',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
        true
      );
      this.loaderService.hide();
    });
  }
}


