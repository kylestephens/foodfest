import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs';
import { Subject }          from 'rxjs/Subject';
import { ConfirmDialog }    from '../shared/model/confirmDialog';

@Injectable()
export class ConfirmDialogService {
  private dialogConfirmedSubject = new Subject<any>();

  dialogConfirmed = this.dialogConfirmedSubject.asObservable();

  confirmDialog(confirmDialog: ConfirmDialog) {
    this.dialogConfirmedSubject.next(confirmDialog);
  }

}
