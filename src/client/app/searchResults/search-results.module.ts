import { NgModule } 						        from '@angular/core';
import { SearchResultsComponent } 			from './search-results.component';
import { SearchResultsRoutingModule } 	from './search-results-routing.module';
import { SearchResultsCardListModule } 	from './cardList/search-results-card-list.module';
import { SearchResultsFiltersModule }   from './filters/search-results-filters.module';
import { SharedModule }                 from '../shared/shared.module';

@NgModule({
  imports: [
  	SearchResultsRoutingModule,
  	SearchResultsCardListModule,
    SearchResultsFiltersModule,
    SharedModule
  ],
  declarations: [SearchResultsComponent]
})

export class SearchResultsModule { }
