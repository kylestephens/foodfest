import { NgModule } 						          from '@angular/core';
import { CommonModule } 					        from '@angular/common';
import { SearchResultsCardListComponent } from './search-results-card-list.component';
import { SearchResultsCardModule } 			  from './card/search-results-card.module';

@NgModule({
  imports: [CommonModule, SearchResultsCardModule],
  exports: [SearchResultsCardListComponent],
  declarations: [SearchResultsCardListComponent]
})

export class SearchResultsCardListModule { }
