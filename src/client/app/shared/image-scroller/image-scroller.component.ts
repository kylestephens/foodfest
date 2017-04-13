import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
}                                  from '@angular/core';
import { SettingsService }         from '../../services/settings.service';

@Component({
  moduleId: module.id,
  selector: 'ak-image-scroller',
  templateUrl: 'image-scroller.component.html',
  styleUrls: ['image-scroller.component.css']
})

export class ImageScrollerComponent implements OnInit {

  /**
   * @Input
   * An array of image path strings
   */
  @Input()
  images: Array<string>;

  /**
   * @Input
   * The outer container that does the scrolling
   */
  @ViewChild('scroller')
  public scroller: ElementRef;

  public deviceType: string;

  private scrollDistance: number = 0;
  private currentScroll: number = 0;
  private availableWidth: number = 0;

  constructor(private settingsService: SettingsService) {
    this.deviceType = this.settingsService.getDeviceType();
  };

  ngOnInit() {
    if(this.images && this.images.length > 0) {
      this.scrollDistance = window.innerWidth * 0.5;
      this.currentScroll = this.scroller.nativeElement.scrollLeft;
      let images = document.getElementsByClassName('image-scroller__image-tile');
      for(let i = 0; i < images.length; i++) {
        this.availableWidth += images[i].clientWidth;
      };
    }
  };

  public scrollLeft = function() {
    if (this.currentScroll - this.scrollDistance >= 0) { this.currentScroll -= this.scrollDistance; }
    this.scroller.nativeElement.scrollLeft = this.currentScroll;
  };

  public scrollRight = function() {
    if (this.currentScroll + this.scrollDistance <= this.availableWidth + (window.innerWidth * 1.5)) {
      this.currentScroll += this.scrollDistance;
    }
    this.scroller.nativeElement.scrollLeft = this.currentScroll;
  };

};
