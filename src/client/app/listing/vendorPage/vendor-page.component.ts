import { Component, OnInit }      from '@angular/core';
import {
  LocalStorageService
}                                 from 'ng2-webstorage';
import {
  AgmCoreModule,
  MapTypeStyle
}                                 from 'angular2-google-maps/core';
import { CONSTANT }               from '../../core/constant';

declare var google: any;

/**
 * This class represents the lazy loaded ListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-vendor-page',
  templateUrl: 'vendor-page.component.html',
  styleUrls: ['vendor-page.component.css']
})
export class VendorPageComponent implements OnInit {

  public coverPhotoUrl: string;
  public businessLogoUrl: string;
  public businessName: string;
  public businessWebsite: string;
  public businessDescription: string;
  public businessAddress: string;
  public businessPhoneNum: string;
  public mapLatitude: number;
  public mapLongitude: number;
  public zoomLevel: number = 15;        // google maps zoom level
  public mapStyles: MapTypeStyle[] = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#1f2532"
        },
        {
          "weight": 1.5
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "weight": 1.5
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#f2fbf3"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#1aacc3"
        },
        {
          "weight": 1
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#cae7f3"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];

  constructor(
    private localStorageService: LocalStorageService
  ) {};

  ngOnInit() {
    this._initValuesFromLocalStorage();
  }

  /**
   * If arriving from create listing steps - retrieve
   * from local storage instead of doing a GET
   */
  private _initValuesFromLocalStorage() {
    let stepOne = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
    );
    let stepTwo = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO
    );
    let stepThree = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE
    );
    let stepFour = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR
    );
    let images = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.VENDOR_IMAGES
    );
    let address = this.localStorageService.retrieve(
      CONSTANT.LOCALSTORAGE.LISTING_ADDRESS
    );

    if(images.businessLogo) {
      this.businessLogoUrl = images.businessLogo;
    }
    if(images.coverImage) {
      this.coverPhotoUrl = images.coverImage;
    }
    if(address) {
      this.mapLatitude = address.geometry.location.lat;
      this.mapLongitude = address.geometry.location.lng;
      this.businessAddress = stepTwo.businessAddress;
    }
    this.businessName = stepOne.businessName;
    this.businessPhoneNum = stepTwo.phoneNumber;
    this.businessWebsite = stepTwo.businessWebsite;
    this.businessDescription = stepFour.businessDescription;
  }

}
