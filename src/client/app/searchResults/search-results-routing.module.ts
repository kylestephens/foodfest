import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';
import { SearchResultsComponent } from './search-results.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'search-results', component: SearchResultsComponent }
    ])
  ],
  exports: [RouterModule]
})

export class SearchResultsRoutingModule { }
