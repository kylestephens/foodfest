import { ReflectiveInjector } from '@angular/core';
import { User }   from './user';
import { Vendor } from './vendor';
import { Market } from './market';


export class Message {
  id: number;
  content: string;
  sent_date: any;
  receiver: User;
  sender: User;
  vendor: Vendor;
  market: Market;
  is_read: boolean;
  message_title: string;
  image_path: string;
  last_msg_id: number;
  message_from_name: string;

  constructor(message: any) {
    this.id = message.id ? message.id : null;
    this.content = message.content ? message.content : null;
    this.sent_date = message.sent_date ? this.convertSqlToJsDateTime(message.sent_date) : null;
    this.receiver = message.receiver ? message.receiver : null;
    this.sender = message.sender ? message.sender : null;
    this.vendor = message.vendor ? message.vendor : null;
    this.market = message.market ? message.market : null;
    this.is_read = message.is_read ? message.is_read : null;
    this.message_title = message.message_title ? message.message_title : null;
    this.image_path = message.image_path ? message.image_path : null;
    this.last_msg_id = message.last_msg_id ? message.last_msg_id : null;
    this.message_from_name = message.message_from_name ? message.message_from_name : null;
  }

  convertSqlToJsDateTime(sqlTimestamp: string) {
    let jsDateTime = new Date(sqlTimestamp),
        jsTime = jsDateTime.toLocaleTimeString();

    return jsDateTime.getDate() + '/' + (+jsDateTime.getMonth() + 1) + '/' + jsDateTime.getFullYear() + ', ' + jsTime.slice(0,5) + jsTime.slice(8);
  }

}
