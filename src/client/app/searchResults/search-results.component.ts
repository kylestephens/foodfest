import { Component }       from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import { SelectModule }    from 'ng2-select';
import { CONSTANT }        from '../core/constant';
import { FilterService }   from '../services/filter.service';

/**
 * This class represents the lazy loaded SearchResults.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: ['search-results.component.css']
})

export class SearchResultsComponent {
  sorts: Array<string> = CONSTANT.SEARCH_RESULTS_SORT;
  activeSort: string;

  constructor(private route: ActivatedRoute, private filterService: FilterService) {}

  ngOnInit(): void {
    this.deepLinked();
  }

  onOrderByChange(sort: string) {
    if(this.activeSort !== sort) {
      this.activeSort = sort;
      let currentParams = this.route.snapshot.params;
      this.filterService.updateRouteParam(currentParams, 'sort', sort);
    }
  }

   private deepLinked() {
    let params: any = this.route.snapshot.params;
    this.activeSort = params.sort ? params.sort : CONSTANT.vendor.DEFAULT_SORT;
  }
}
