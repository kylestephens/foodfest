import { NgModule }             from '@angular/core';
import { RouterModule }         from '@angular/router';
import { FourOhFourComponent }  from './404.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: FourOhFourComponent }
    ])
  ],
  exports: [RouterModule]
})
export class FourOhFourRoutingModule { }
