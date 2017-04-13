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
  is_read: boolean;
  name_to_show: string;
  last_msg_id: number;

  constructor(message: any) {
    this.id = message.id ? message.id : null;
    this.content = message.content ? message.content : null;
    this.send_date = message.send_date ? message.send_date : null;
    this.read_date = message.read_date ? message.read_date : null;
    this.receiver = message.receiver ? message.receiver : null;
    this.sender = message.sender ? message.sender : null;
    this.vendor = message.vendor ? message.vendor : null;
    this.is_read = message.is_read ? message.is_read : null;
    this.name_to_show = message.name_to_show ? message.name_to_show : null;
    this.last_msg_id = message.last_msg_id ? message.last_msg_id : null;
  }
}
