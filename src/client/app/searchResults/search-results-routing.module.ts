import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';
import { SearchResultsComponent } from './search-results.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchResultsComponent }
    ])
  ],
  exports: [RouterModule]
})

export class SearchResultsRoutingModule { }
