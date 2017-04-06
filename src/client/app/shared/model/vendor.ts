/*
Class for vendors. It corresponds to vendorsModel in service.
*/
import { SafeResourceUrl } from '@angular/platform-browser';
import { Style }           from './style';


export class Vendor {
	id: number;
	user_id: number;
	business_name: string;
  business_website: string;
  business_address: string;
  business_latitude: number;
  business_longitude: number;
  business_setup: Array<any>;
  event_types: Array<any>;
  diet_requirements: Array<any>;
  phone_num: string;
	description: string;
  logo_photo: string;
	images_path: string;
  cover_photo_path: string;
  average_rating: number;
  num_of_reviews: number;
	date_registered: string;
	last_updated: string;
  styles: Style[];

  safe_cover_photo_path: SafeResourceUrl | string;
}
