import {
  Component,
  ElementRef,
  NgZone,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { CreateListingService }           from '../../create-listing.service';
import { AgmCoreModule, MapsAPILoader }   from 'angular2-google-maps/core';
import { SelectModule }                   from 'ng2-select';
import { CONSTANT }                       from '../../../core/constant';

declare var google: any;

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-two',
  templateUrl: 'create-listing-step-two.component.html'
})

export class CreateListingStepTwoComponent implements AfterViewInit {

  public currentStep: number;
  public latitude: number;
  public longitude: number;

  @ViewChild('autocompleteSearch')
  public searchElementRef: ElementRef;

  constructor(
    private createListingService: CreateListingService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.currentStep = 1;
  };

  ngAfterViewInit() {
    var me = this;

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(me.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
        });
      });
    });
  };

  public nextStep() {
    this.createListingService.nextStep();
  };

  public previousStep() {
    this.createListingService.previousStep();
  };

  // Dummy data for select / multiselect
  public items:Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];

  private value:any = {};

  // Handlers for select / multiselect
  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }

};
