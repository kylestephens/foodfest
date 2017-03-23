import { NgModule } 						        from '@angular/core';
import { SearchResultsComponent } 			from './search-results.component';
import { SearchResultsRoutingModule } 	from './search-results-routing.module';
import { SearchResultsCardListModule } 	from './cardList/search-results-card-list.module';

@NgModule({
  imports: [
  	SearchResultsRoutingModule,
  	SearchResultsCardListModule
  ],
  declarations: [SearchResultsComponent]
})

export class SearchResultsModule { }
