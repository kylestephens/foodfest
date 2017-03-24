import { NgModule } 					        from '@angular/core';
import { CommonModule }               from '@angular/common';
import { SharedModule }               from '../../../shared/shared.module';
import { SearchResultsCardComponent } from './search-results-card.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [SearchResultsCardComponent],
  declarations: [SearchResultsCardComponent]
})

export class SearchResultsCardModule { }
