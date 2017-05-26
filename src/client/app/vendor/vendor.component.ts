import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy
}                                 from '@angular/core';
import { Response }               from '@angular/http';
import { ActivatedRoute }         from '@angular/router';
import { Router }                 from '@angular/router';
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
import { MessagingService }       from '../services/messaging.service';
import { SettingsService }        from '../services/settings.service';
import { AccountService}          from '../services/account.service';
import { InboxService }           from '../services/inbox.service';

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
  public messageText: string;
  public vendor = new Vendor();
  public zoomLevel: number = 15;        // google maps zoom level
  public isEditing: boolean = false;
  public isOwnVendor: boolean = false;
  public formattedStyles: string;
  public formattedEventTypes: string;
  public formattedBusinessSetups: string;
  public formattedDietRequirements: string;
  public additionalImages: Array<string> = [];
  public serverUrl: string;
  public additionalImagesLoaded: boolean = false;
  public vendorLoaded: boolean = false;
  public imagesLoaded: boolean = false;
  public itemType: string = 'Menu';
  public isLoggedIn: boolean;
  public placeholder: string;

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

  private subscriptions: Array<Subscription> = [];
  private vendorId: number;

  constructor(
    private localStorageService: LocalStorageService,
    private mapsAPILoader: MapsAPILoader,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private inboxService: InboxService,
    private accountService: AccountService,
    private messagingService: MessagingService
  ) {
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_EDIT)) {
      this.isEditing = true;
    }
    this.serverUrl = this.settingsService.getServerBaseUrl() + '/';
  };

  ngOnInit() {
    this.isLoggedIn = this.accountService.isLoggedIn();
    this.setPlaceholder();

    this.subscriptions.push(this.route.params.subscribe(params => {
      this.vendorId = +params['id'];
      this.isOwnVendor = this.accountService.isOwnVendor(this.vendorId);
    }));

    this.subscriptions.push(this.accountService.getMessage().subscribe(subMessage => {
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN) {
       this.isLoggedIn = this.accountService.isLoggedIn();
       this.setPlaceholder();
      }
    }));

    this.restService.get(
      this.settingsService.getServerBaseUrl() + '/vendors/' + this.vendorId
    ).then((response: Response) => {
      this._onVendorResponse(response: Response);
    }, (reason: any) => {
      this.router.navigate(['/404']);
    });
  }

  ngAfterViewInit() {
    this.mapsAPILoader.load();
  };

  ngOnDestroy() {
   for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  };

  setPlaceholder() {
    this.placeholder = this.isLoggedIn ? 'Write your message here...' : 'You have to be logged in to send a message.';
  };

  public onClickBack() {
    let prevPage: string = this.settingsService.getReferralRoute();
    let params: any = {};
    let prevPageRoute: string = '';
    if(prevPage) {
      let prevPageSplit = prevPage.split(';');
      prevPageRoute = prevPageSplit[0];
      if(prevPageSplit.length > 1) {
        for(let i = 1; i < prevPageSplit.length; i++) {
          let paramSplit = prevPageSplit[i].split('=');
          params[paramSplit[0]] = paramSplit[1].replace('%2C', ',');
        }
      }
      this.router.navigate([prevPageRoute, params]);
    } else {
      this.router.navigate(['/search-results']);
    }
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

  public isVendorDetailsCardShown() {
    if(
      !this.vendor.facebook_address &&
      !this.vendor.instagram_address &&
      !this.vendor.business_website &&
      !this.vendor.business_latitude &&
      !this.vendor.business_address) {
      return false;
    }
    return true;
  };

  public sendMessage() {
    if(!this.messageText.trim()) return;

    let params = {
        sender_id: this.accountService.getUser().id,
        receiver_id: this.vendor.user_id,
        vendor_id: this.vendor.id,
        content: this.messageText
      }

    this.inboxService.createMessage(params, 'vendor-messaging').then( message => {
      if(message) {
        this.messageText = null;
      }
    });
  };

  private _onVendorResponse(response: Response) {
    if(response.json() == null) {
      this.router.navigate(['/404']);
      return;
    }

    this.vendorLoaded = true;
    this.vendor = response.json()[0] as Vendor;

    // ensure exists. ensure active - if not active, only owner can view it!
    if(this.vendor.active_vendor == 0 && !this.isOwnVendor) {
      this.router.navigate(['/404']);
      return;
    }

    this.formattedStyles= this._formatFilterString(this.vendor.styles);
    this.formattedBusinessSetups = this._formatFilterString(this.vendor.business_setup);
    this.formattedEventTypes = this._formatFilterString(this.vendor.event_types);
    this.formattedDietRequirements = this._formatFilterString(this.vendor.diet_requirements);
    this.vendor.images.forEach((imageUrl: any) => {
      this.additionalImages.push(this.serverUrl + imageUrl);
    });
    this.additionalImagesLoaded = true;
    this.imagesLoaded = true;
    if(this.vendor.business_type === 'artisan food') {
      this.itemType = 'Product';
    } else if(this.vendor.business_type === 'equipment hire') {
      this.itemType = 'Item';
    }
  };

  private _formatFilterString(filterObject: any): string {
    if (!filterObject) return '';
    if (!Array.isArray(filterObject)) return filterObject.text;
    let formattedStr = '';
    filterObject.forEach((filter: any, index: number) => {
      if(index > 0) formattedStr += ', '
      formattedStr += filter.text;
    });
    return formattedStr;
  };

}
