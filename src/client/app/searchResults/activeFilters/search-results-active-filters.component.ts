import { Component }       from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import { FilterService }   from '../../services/filter.service';
import { Subscription }    from 'rxjs/Subscription';
import { SearchFilter }     from './../../shared/model/searchFilter';

/**
 * This class represents active filters component on search results page.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results-active-filters',
  templateUrl: 'search-results-active-filters.component.html',
  styleUrls: ['search-results-active-filters.component.css'],
})

export class SearchResultsActiveFiltersComponent {
  private subscriptions: Subscription [] = [];

  activeFilters: Array<any> = [];
  ratings: any|Array<any>;

  constructor(
    private filterService: FilterService,
    private route: ActivatedRoute) {
    this.subscriptions.push(
      filterService.filterAdded.subscribe(
        searchFilter => {
          this.activeFilters.push(searchFilter);
          if(searchFilter.name === 'rating') {
             this.ratings = Array(searchFilter.value);
             this.ratings.fill().map((x: number, i: number) => i);
          }
      })
    );

    this.subscriptions.push(
      filterService.filterRemoved.subscribe(
        searchFilter => {
          let index:number;

          if(searchFilter.name === 'rating') {
            index = this.activeFilters.map(function(activeFilter) { return activeFilter.name; }).indexOf(searchFilter.name);
          }
          else {
            let filter = this.activeFilters.find(activeFilter => activeFilter.name === searchFilter.name && activeFilter.id === searchFilter.id);
            index = this.activeFilters.indexOf(filter, 0);
          }

          if (index > -1) {
             this.activeFilters.splice(index, 1);
          }
      })
    );
  }

  ngOnDestroy() {
      for (let subscription of this.subscriptions) {
        subscription.unsubscribe();
      }
  }

  onClick(event: any, searchFilter: SearchFilter) {
    let currentParams = this.route.snapshot.params;
    if(searchFilter.name !== 'rating') {
       searchFilter.isSelected = false;
    }
    else {
      searchFilter.value = 0;
    }
    this.activeFilters.splice(this.activeFilters.indexOf(searchFilter, 0), 1);
    this.filterService.removeFilterFromActive(searchFilter);

    if(searchFilter.name !== 'rating') {
      this.filterService.updateRouteParams(currentParams, searchFilter.name, searchFilter);
    }
    else {
      this.filterService.updateRouteParamRating(currentParams, searchFilter.name, searchFilter.value);
    }
  }

}
