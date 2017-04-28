import { NgModule }             from '@angular/core';
import { RouterModule }         from '@angular/router';
import { MarketsComponent }     from './markets.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: MarketsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class MarketsRoutingModule { }
