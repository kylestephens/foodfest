import { Component, Input }        from '@angular/core';
import { SettingsService }         from '../../services/settings.service';

@Component({
  moduleId: module.id,
  selector: 'ak-image-scroller',
  templateUrl: 'image-scroller.component.html',
  styleUrls: ['image-scroller.component.css']
})

export class ImageScrollerComponent {

  /**
   * @param
   * An array of image path strings
   */
  @Input()
  images: Array<string>;

  public deviceType: string;

  constructor(private settingsService: SettingsService) {
    this.deviceType = this.settingsService.getDeviceType();
  };

};
