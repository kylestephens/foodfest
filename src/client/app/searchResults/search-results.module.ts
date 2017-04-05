import { NgModule } 						            from '@angular/core';
import { SearchResultsComponent } 			    from './search-results.component';
import { SearchResultsRoutingModule } 	    from './search-results-routing.module';
import { SearchResultsService }             from './search-results.service';
import { FilterService }                    from './filter.service';
import { SearchResultsCardListModule } 	    from './cardList/search-results-card-list.module';
import { SearchResultsActiveFiltersModule } from './activeFilters/search-results-active-filters.module'
import { SearchResultsFiltersModule }       from './filters/search-results-filters.module';
import { SharedModule }                     from '../shared/shared.module';

import { SelectModule }                     from 'ng2-select';

@NgModule({
  imports: [
  	SearchResultsRoutingModule,
  	SearchResultsCardListModule,
    SearchResultsActiveFiltersModule,
    SearchResultsFiltersModule,
    SelectModule,
    SharedModule
  ],
  declarations: [
    SearchResultsComponent
  ],
  providers: [
    SearchResultsService,
    FilterService
  ]
})

export class SearchResultsModule { }
