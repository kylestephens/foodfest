import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';
import { LeaveReviewComponent }     from   './leave-review.component';
import { AuthGuard }                from '../auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LeaveReviewComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})

export class LeaveReviewRoutingModule { }
