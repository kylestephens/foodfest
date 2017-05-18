import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';
import { ListingCompleteComponent }     from './listing-complete.component';
import { AuthGuard }                    from '../auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ListingCompleteComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class ListingCompleteRoutingModule { }
