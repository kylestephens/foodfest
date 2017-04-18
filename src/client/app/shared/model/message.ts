import {ReflectiveInjector} from '@angular/core';
import { User }   from './user';
import { Vendor } from './vendor';


export class Message {
  id: number;
  content: string;
  sent_date: any;
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
    this.sent_date = message.sent_date ? this.convertSqlToJsDateTime(message.sent_date) : null;
    this.read_date = message.read_date ? this.convertSqlToJsDateTime(message.read_date) : null;
    this.receiver = message.receiver ? message.receiver : null;
    this.sender = message.sender ? message.sender : null;
    this.vendor = message.vendor ? message.vendor : null;
    this.is_read = message.is_read ? message.is_read : null;
    this.name_to_show = message.name_to_show ? message.name_to_show : null;
    this.last_msg_id = message.last_msg_id ? message.last_msg_id : null;
  }

  convertSqlToJsDateTime(sqlTimestamp: string) {
    let jsDateTime = new Date(sqlTimestamp),
        jsTime = jsDateTime.toLocaleTimeString();

    return jsDateTime.getDate() + '/' + (+jsDateTime.getMonth() + 1) + '/' + jsDateTime.getFullYear() + ', ' + jsTime.slice(0,5) + jsTime.slice(8);
  }

}
