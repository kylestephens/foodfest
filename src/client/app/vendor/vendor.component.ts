import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy
}                                 from '@angular/core';
import { Response }               from '@angular/http';
import { ActivatedRoute }         from '@angular/router';
import {
  LocalStorageService
}                                 from 'ng2-webstorage';
import { Subscription }           from 'rxjs/Subscription';
import {
  AgmCoreModule,
  MapTypeStyle,
  MapsAPILoader
}                                 from 'angular2-google-maps/core';
import { RestService }            from '../services/rest.service';
import { SettingsService }        from '../services/settings.service';
import { ImageScrollerComponent } from '../shared/image-scroller/image-scroller.component';
import { TwitterFeedComponent }   from '../shared/twitter-feed/twitter-feed.component';
import { Vendor }                 from '../shared/model/vendor';
import { CONSTANT }               from '../core/constant';

/**
 * This class represents the lazy loaded ListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-vendor',
  templateUrl: 'vendor.component.html',
  styleUrls: ['vendor.component.css']
})
export class VendorComponent implements OnInit, OnDestroy {

  public vendor = new Vendor();
  public zoomLevel: number = 15;        // google maps zoom level
  public isEditing: boolean = false;
  public formattedStyles: string;
  public formattedEventTypes: string;
  public formattedBusinessSetups: string;
  public formattedDietRequirements: string;
  public additionalImages: Array<string> = [];
  public serverUrl: string;
  public imagesLoaded: boolean = false;

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

  private subscription: Subscription;
  private vendorId: number;

  constructor(
    private localStorageService: LocalStorageService,
    private mapsAPILoader: MapsAPILoader,
    private restService: RestService,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_EDIT)) {
      this.isEditing = true;
    }
    this.serverUrl = this.settingsService.getServerBaseUrl() + '/';
  };

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.vendorId = +params['id'];
    });
    if(!this.vendorId) {
      this._initValuesFromLocalStorage(); // when creating for first time
    } else {
      return this.restService.get(
         this.settingsService.getServerBaseUrl() + '/vendor/' + this.vendorId
      ).then((response: Response) => {
        this.vendor = response.json()[0] as Vendor;
        this.formattedStyles= this._formatFilterString(this.vendor.styles);
        this.formattedBusinessSetups = this._formatFilterString(this.vendor.business_setup);
        this.formattedEventTypes = this._formatFilterString(this.vendor.event_types);
        this.formattedDietRequirements = this._formatFilterString(this.vendor.diet_requirements);
        this.vendor.images.forEach((imageUrl: any) => {
          this.additionalImages.push(this.serverUrl + imageUrl);
        });
        this.imagesLoaded = true;
      });
    }
  }

  ngAfterViewInit() {
    this.mapsAPILoader.load();
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  };

  /**
   * Double forward slash ('//') is necessary to avoid
   * prepending the app base path
   */
  public openFacebookLink() {
    var w: any = window.open();
    w.location.href = '//' + this.vendor.facebook_address;
  };

  public openInstagramLink() {
    var w: any = window.open();
    w.location.href = '//' + this.vendor.instagram_address;
  };

  public openBusinessWebsiteLink() {
    var w: any = window.open();
    w.location.href = '//' + this.vendor.business_website;
  };

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
      this.vendor.logo_path = images.businessLogo;
    }
    if(images.coverImage) {
      this.vendor.cover_photo_path = images.coverImage;
    }
    if(address) {
      this.vendor.business_latitude = address.geometry.location.lat;
      this.vendor.business_longitude = address.geometry.location.lng;
      this.vendor.business_address = stepTwo.businessAddress;
    }
    this.formattedStyles= this._formatFilterString(stepOne.styles);
    this.formattedBusinessSetups = this._formatFilterString(stepOne.businessSetup);
    this.formattedEventTypes = this._formatFilterString(stepOne.eventType);
    this.formattedDietRequirements = this._formatFilterString(stepOne.dietRequirements);
    this.additionalImages = images.businessAdditionalImages;

    this.vendor.business_name = stepOne.businessName;
    this.vendor.phone_num = stepTwo.phoneNumber;
    this.vendor.business_website = stepTwo.businessWebsite;
    this.vendor.description = stepFour.businessDescription;
    this.vendor.twitter_address = stepThree.twitterAddress;
    this.vendor.facebook_address = stepThree.facebookAddress;
    this.vendor.instagram_address = stepThree.instagramAddress;
  }

  private _formatFilterString(filterObject: any): string {
    if (!filterObject) return '';
    if (!Array.isArray(filterObject)) return filterObject.text;
    let formattedStr = '';
    filterObject.forEach((filter: any, index: number) => {
      if(index > 0) formattedStr += ', '
      formattedStr += filter.text;
    });
    return formattedStr;
  }

}
