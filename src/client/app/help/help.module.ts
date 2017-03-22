import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { HelpComponent }            from './help.component';
import { HelpRoutingModule }        from './help-routing.module';

@NgModule({
  imports: [CommonModule, HelpRoutingModule],
  declarations: [HelpComponent],
  exports: [HelpComponent]
})

export class HelpModule { }
