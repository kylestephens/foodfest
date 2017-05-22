import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { CateringJobsComponent }      from './cateringJobs.component';
import { CateringJobsRoutingModule }  from './cateringJobs-routing.module';

@NgModule({
  imports: [CommonModule, CateringJobsRoutingModule],
  declarations: [CateringJobsComponent],
  exports: [CateringJobsComponent]
})

export class CateringJobsModule { }
