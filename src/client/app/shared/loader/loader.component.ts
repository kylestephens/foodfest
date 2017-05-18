import {
  Component,
  OnDestroy,
  ViewEncapsulation
}                                 from '@angular/core';
import { Subscription }           from 'rxjs/Subscription';

import { LoaderService }          from '../../services/loader.service';

import { CONSTANT }               from '../../core/constant';

/**
 * This class represents the loader component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoaderComponent implements OnDestroy {

  public isLoaderActive: boolean = false;

  private subscription: Subscription;
  private subMessage: any;

  constructor(
    private loaderService: LoaderService
  ) {
    // subscribe to loader service messages
    this.subscription = this.loaderService.getMessage().subscribe(subMessage => {
      console.debug('LoaderComponent::subscription');
      this.subMessage = subMessage;
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.LOADER.SHOW_LOADER) {
        this._showLoader();
      }
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.LOADER.HIDE_LOADER) {
        this._hideLoader();
      }
    });
  };

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  };

  private _showLoader = function() {
    this.isLoaderActive = true;
  };

  private _hideLoader = function() {
    this.isLoaderActive = false;
  };

};
