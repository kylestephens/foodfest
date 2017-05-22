import { NgModule }             from '@angular/core';
import { RouterModule }         from '@angular/router';
import { CateringJobsComponent }  from './cateringJobs.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: CateringJobsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CateringJobsRoutingModule { }
