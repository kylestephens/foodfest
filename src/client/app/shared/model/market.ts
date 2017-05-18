import { MarketOpeningDay } from './marketOpeningDay';


export class Market {
  id:                number;
  organised_by:      number;
  name:              string;
  description:       string;
  location:          string;
  county:            string;
  allow_contact:     number; //bool, whether or not allowed to contact
  created_date:      string;
  last_updated:      string;
  organised_by_name: string;
  opening_days:      Array<MarketOpeningDay>;
}
