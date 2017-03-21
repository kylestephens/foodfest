import { NgModule }             from '@angular/core';
import { RouterModule }         from '@angular/router';
import { CommercialComponent }  from './commercial.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'commercial', component: CommercialComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CommercialRoutingModule { }
