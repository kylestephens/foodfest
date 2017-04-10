export class ConfirmDialog {
  message:     string;
  action:      string;
  record:      any;

  constructor(message: string, action: string, record: any ) {
    this.message = message;
    this.action = action;
    this.record = record;
  }
}
