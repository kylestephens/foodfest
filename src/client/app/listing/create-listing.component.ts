import { Component, ElementRef, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { AgmCoreModule, MapsAPILoader }   from 'angular2-google-maps/core';

declare var google: any;

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing',
  templateUrl: 'create-listing.component.html',
  styleUrls: ['create-listing.component.css']
})

export class CreateListingComponent implements AfterViewInit {

  public currentStep: number;
  public latitude: number;
  public longitude: number;

  @ViewChild('autocompleteSearch')
  public searchElementRef: ElementRef;

  constructor(
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

  public previousStep = function() {
    this.currentStep--;
    window.scrollTo(0, 0);
  };

  public nextStep = function() {
    this.currentStep++;
    window.scrollTo(0, 0);
  };

};
