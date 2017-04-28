import { MarketOpeningDay } from './marketOpeningDay';


export class Market {
  id:                number;
  organized_by:      number;
  name:              string;
  description:       string;
  location:          string;
  allow_contact:     number; //bool, whether or not allowed to contact
  created_date:      string;
  last_updated:      string;
  organized_by_name: string;
  opening_days:      Array<MarketOpeningDay>;
}
