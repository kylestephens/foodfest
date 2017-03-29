import { NgModule }                       from '@angular/core';
import { FilterComponentModule }          from './filter-component/filter-component.module';
import { SearchResultsFiltersComponent }  from './search-results-filters.component';

@NgModule({
  imports: [FilterComponentModule],
  exports: [SearchResultsFiltersComponent],
  declarations: [SearchResultsFiltersComponent]
})

export class SearchResultsFiltersModule { }
