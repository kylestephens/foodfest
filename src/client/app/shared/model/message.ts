import { User }   from './user';
import { Vendor } from './vendor';

export class Message {
  id: number;
  content: string;
  send_date: any;
  read_date: any;
  receiver: User;
  sender: User;
  vendor: Vendor;
  name_to_show: string;
  show_vendor: boolean;
  original_parent_msg_id: number;
}
