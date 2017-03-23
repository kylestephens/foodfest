import { NgModule } 						          from '@angular/core';
import { Ng2PaginationModule }            from 'ng2-pagination';
import { CommonModule } 					        from '@angular/common';
import { SearchResultsCardListComponent } from './search-results-card-list.component';
import { SearchResultsCardModule } 			  from './card/search-results-card.module';

@NgModule({
  imports: [Ng2PaginationModule, CommonModule, SearchResultsCardModule],
  exports: [SearchResultsCardListComponent],
  declarations: [SearchResultsCardListComponent]
})

export class SearchResultsCardListModule { }
