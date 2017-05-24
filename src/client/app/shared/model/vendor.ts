/**
 * Class for vendors.
 * It corresponds to vendorsModel in service.
 */
import { BusinessSetup }       from './businessSetup';
import { BusinessType }        from './businessType';
import { DietRequirement }     from './dietRequirement';
import { StripeSubscription }  from './stripeSubscription';
import { Style }               from './style';

export class Vendor {
	id:                  number;
	user_id:             number;
  active_vendor:       boolean; //bool, whether or not vendor paid
	business_name:       string;
  business_website:    string;
  business_address:    string;
  business_latitude:   number;
  business_longitude:  number;
  phone_num:           string;
  facebook_address:    string;
  twitter_address:     string;
  instagram_address:   string;
	description:         string;
  logo_photo:          number;
  logo_path:           string;
  num_photos:          number;
	images:              Array<string>;
  cover_photo:         number;     // bool, whether or not vendor uploaded img
  cover_photo_path:    string;
  average_rating:      number;
  num_of_reviews:      number;
	date_registered:     any;
	last_updated:        string;
  subscription:        StripeSubscription;
  business_type:       string;
  business_setup:      Array<BusinessSetup>;
  diet_requirements:   Array<DietRequirement>;
  event_types:         Array<any>;
  styles:              Style[];
  listed_items:        Array<any>;
}
