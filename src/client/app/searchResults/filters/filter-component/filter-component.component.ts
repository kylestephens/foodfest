import { Component,
         Input, Output,
         ElementRef,
         EventEmitter }     from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { FilterService }    from '../../filter.service';
import { BrowserService }   from '../../../services/browser.service';
import { SearchFilter }     from '../../../shared/model/searchFilter';
import { Subscription }     from 'rxjs/Subscription';

/**
 * This class represents individual filter component on search results page.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results-filter-component',
  templateUrl: 'filter-component.html',
  styleUrls: ['filter-component.css']
})

export class FilterComponent {
  @Input()
  text: string;

  @Input()
  title: string;

  @Input()
  records: Array<any>;

  @Input()
  rating: number;

  @Input()
  icon: string;

  /*
  * Emit padding to be set on grandparent in phone mode
  */
  @Output()
  notify: EventEmitter<number> = new EventEmitter<number>();

  isHidden: boolean = false;
  paddingBottom: number = 0;

  private subscriptions: Subscription[] = [];
  private browser: any = this.browserService.get();
  private isPhone: boolean = this.browser.deviceType === 'phone';
  private elementToShow: HTMLElement = null;

  constructor(private route: ActivatedRoute, private filterService: FilterService, private browserService: BrowserService) {
    this.setVisiabilityPerScreenSize();

    this.subscriptions.push(filterService.filterRemovedFromActive.subscribe(
      searchFilter => {
        if(searchFilter.name === 'rating' && searchFilter.name === this.text) {
          this.rating = 0;
        }
        else if(searchFilter.name === this.text) {
          let index = this.records.map(function(record) { return record.id; }).indexOf(searchFilter.id);
          if (index > -1) {
           this.records[index].isSelected = searchFilter.isSelected;
          }
        }
      }));

    if(this.isPhone) {
      this.subscriptions.push(filterService.filterShown.subscribe(
      name => {
        if(name !== this.text) {
          this.isHidden = true;
        }
      }));
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  setVisiabilityPerScreenSize() {
    if(this.isPhone) {
      this.isHidden = true;
    }
  }

  onClickRecord(event: any, record: any) {
    let currentParams = this.route.snapshot.params;
    record.isSelected = !record.isSelected;

    let searchFilter = new SearchFilter(this.text, record);
    if(record.isSelected) this.filterService.addFilter(searchFilter);
    else this.filterService.removeFilter(searchFilter);

    this.filterService.updateRouteParamsBySelected(currentParams, this.text, record);
  }

  onClickRating(event: any, rating: number) {
    let currentParams = this.route.snapshot.params;

    if(+this.rating === +rating) {
      this.rating = 0;
    }
    else {
      this.rating = rating;
    }
    let searchFilter = new SearchFilter(this.text, null, this.rating);
    if(this.rating !== 0 ) this.filterService.addFilter(searchFilter);
    else this.filterService.removeFilter(searchFilter);

    this.filterService.updateRouteParam(currentParams, this.text, ''+this.rating);
  }

  /**
  * Set padding of grandparent to height of content in phone mode
  */
  onClickFilterTitle(element: any) {
    if(this.isPhone) {
      this.isHidden = !this.isHidden;

      if(!this.isHidden) {
        this.filterService.showFilter(this.text);
        this.elementToShow = this.elementToShow ? this.elementToShow : <HTMLElement> document.getElementsByClassName('filter-component__content '+ this.text)[0];
        this.paddingBottom = this.paddingBottom ? this.paddingBottom : this.elementToShow.offsetHeight;
      }
      else {
        this.paddingBottom = 0;
      }
      this.notify.emit(this.paddingBottom);
    }
  }

  onClickCloseContent() {
    this.isHidden = true;
    this.paddingBottom = 0;
    this.notify.emit(this.paddingBottom);
  }

}


