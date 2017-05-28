import { Component,
         ElementRef,
         NgZone,
         ViewChild,
         OnInit }           from '@angular/core';
import { FormArray,
         FormBuilder,
         FormControl,
         FormGroup,
         Validators }          from '@angular/forms';
import { AgmCoreModule }       from 'angular2-google-maps/core/core-module';
import { MapsAPILoader }       from 'angular2-google-maps/core/services';
import { CONSTANT }            from '../../../../core/constant';
import { CreateMarketService } from '../../create-market.service';
import { ValidationService }   from '../../../../services/validation.service';
import { County }              from '../../../../shared/model/county';

declare var google: any;

@Component({
  moduleId: module.id,
  selector: 'ak-create-market-step-one',
  templateUrl: 'create-market-step-one.component.html',
  styleUrls: ['create-market-step-one.component.css']
})

export class CreateMarketStepOneComponent implements OnInit {

  @ViewChild('autocompleteSearchMarket')
  public searchMarketElementRef: ElementRef;

  public createMarketForm: FormGroup;
  public weekDays: Array<any> = CONSTANT.WEEK_DAYS;
  public timeSlots: Array<string> = ['',...CONSTANT.TIME_SLOTS];
  private googleApiOptions = { componentRestrictions: {country: 'ie'} };
  private marketLocation: string;
  private marketCounty: string;
  private counties: County[];

  constructor (
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private createMarketService: CreateMarketService
  ) {
    this.createMarketForm = this.fb.group({
      'marketName': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(100)])),
      'marketDescription': new FormControl(null, [ Validators.maxLength(500) ]),
      'marketLocation': [ null, Validators.compose([Validators.required, Validators.maxLength(300)])],
      'marketOpeningDays': new FormArray( [], ValidationService.checkRequiredArray)
    });
    this._initMarketOpeningDays();
  };

  // Needed to resolve issue documented here - https://github.com/angular/angular-cli/issues/6099
  get marketOpeningDays() { return <FormArray>this.createMarketForm.get('marketOpeningDays'); }

  _initMarketOpeningDays() {
    for(let weekDay of this.weekDays) {
      (<FormArray>this.createMarketForm.get('marketOpeningDays')).push(this.fb.group({
        id: weekDay.id,
        name: weekDay.name,
        checked: false,
        timeFrom: [null],
        timeTo: [null]
      }));
    }
  }

  ngOnInit() {
    if(this.createMarketService.getStoredMarket().firstStep) {
      this._restoreFormValues(this.createMarketService.getStoredMarket().firstStep);
    }
  }

  ngAfterViewInit() {
    this.mapsAPILoader.load().then(() => {
      this._setMarketAutocomplete();
      this._getCounties();
    });
  }

  resetTimes(marketOpeningDay: any) {
    marketOpeningDay.controls['timeFrom'].setValue(null);
    marketOpeningDay.controls['timeTo'].setValue(null);
  }

  submitForm(value: any) {
    if(this.createMarketForm.valid) {
      this._checkMarketLocation(this._nextStep.bind(this), value);
    } else {
      // user might have hit next button without completing
      // some mandatory fields - trigger validation ! :)
      for (let i in this.createMarketForm.controls) {
        this.createMarketForm.controls[i].markAsTouched();
      }
    }
  }

  private _setMarketAutocomplete() {
    let autocomplete = new google.maps.places.Autocomplete(this.searchMarketElementRef.nativeElement, this.googleApiOptions);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        // get the place result
        let place = google.maps.places.PlaceResult = autocomplete.getPlace();

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          this.marketCounty = null;
          return;
        }
        this._setMarketLocationDetails(place);
      });
    });
  }

  private _getCounties() {
    this.ngZone.run(() => {
      this.createMarketService.getCounties().then(counties => {
        this.counties = counties;
      });
    });
  }

  private _nextStep(value: any) {
    let countyName = this.marketCounty;
    let county = this.counties ? this.counties.filter((obj: any) => {
        return obj.name === countyName;
    })[0] : null;

    value.county = county;
    this.createMarketService.setStoredMarket(value, 1);
    this.createMarketService.nextStep();
  }

  private _checkMarketLocation(done: any, value: any) {
    let submittedMarketLocation = this.createMarketForm.controls['marketLocation'].value;

    if (this.marketLocation === submittedMarketLocation) {
        return done(value);
    }
    else {
      let request = {
        input: submittedMarketLocation
      };

      Object.assign(request, this.googleApiOptions);

      let service = new google.maps.places.AutocompleteService(request);

      service.getPlacePredictions(request, (results: any, status: any) => {
        if(status === 'OK' && results.length === 1) {
          let request = { placeId: results[0].place_id },
              service = new google.maps.places.PlacesService(this.searchMarketElementRef.nativeElement);

          service.getDetails(request, (result: any, stauts: any) => {
            if(status === 'OK') {
              this._setMarketLocationDetails(result);
              return done(value);
            }
            else {
              this.marketCounty = null;
              this.marketLocation = null;
              return done(value);
            }
          })
        }
        else {
          this.marketCounty = null;
          this.marketLocation = null;
          return done(value);
        }
      });
    }
  }

  private _setMarketLocationDetails(place: any) {
    let county = place.address_components.filter(( address: any ) => {
      let found = false;
      for(let type of address.types) {
        if(type === 'administrative_area_level_1') {
          found = true;
        }
    }
    return found ? true : false;
    })[0];

    this.marketCounty = county.short_name ? county.short_name.split(' ')[1] : null;

    //set address details
    this.createMarketForm.controls['marketLocation'].setValue(
      this.searchMarketElementRef.nativeElement.value
    );
    this.marketLocation = this.searchMarketElementRef.nativeElement.value;
  }

  private _restoreFormValues(values: any) {
    if(values.marketName) {
      this.createMarketForm.controls['marketName'].setValue(values.marketName);
    }
    if(values.marketDescription) {
      this.createMarketForm.controls['marketDescription'].setValue(values.marketDescription);
    }
    if(values.marketLocation) {
      this.createMarketForm.controls['marketLocation'].setValue(values.marketLocation);
      this.marketLocation = values.marketLocation;
      this.marketCounty = values.county ? values.county.name : null;
    }
    if(values.marketOpeningDays) {
      this.createMarketForm.controls['marketOpeningDays'].setValue(values.marketOpeningDays);
    }
  }
}


