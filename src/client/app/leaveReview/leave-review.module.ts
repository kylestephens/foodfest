import { NgModule }                     from '@angular/core';
import { LeaveReviewRoutingModule }     from './leave-review-routing.module';
import { LeaveReviewComponent }         from './leave-review.component';
import { LeaveReviewService }           from './leave-review.service';
import { SharedModule }                 from '../shared/shared.module';

@NgModule({
  imports: [LeaveReviewRoutingModule, SharedModule],
  exports: [LeaveReviewComponent],
  declarations: [LeaveReviewComponent],
  providers: [ LeaveReviewService ]
})

export class LeaveReviewModule { }
