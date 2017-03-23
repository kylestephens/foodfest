/*
Class for vendors. It corresponds to vendorsModel in service.
*/

class Cuisine {
  id:    number;
  name:  string;
}


export class Vendor {
	id: number;
	user_id: number;
	business_name: string;
	description: string;
	images_path: string;
  cover_photo_path: string;
  average_rating: number;
  num_of_reviews: number;
	date_registered: string;
	last_updated: string;
  cuisines: Cuisine[];
}
