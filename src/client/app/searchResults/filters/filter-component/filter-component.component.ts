import { Component, Input } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { FilterService }    from '../../../services/filter.service';
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

  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private filterService: FilterService) {
     this.subscription = filterService.filterRemovedFromActive.subscribe(
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
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickRecord(event: any, record: any) {
    let currentParams = this.route.snapshot.params;
    record.isSelected = !record.isSelected;

    let searchFilter = new SearchFilter(this.text, record);
    if(record.isSelected) this.filterService.addFilter(searchFilter);
    else this.filterService.removeFilter(searchFilter);

    this.filterService.updateRouteParams(currentParams, this.text, record);
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

    this.filterService.updateRouteParamRating(currentParams, this.text, this.rating);
  }
}


