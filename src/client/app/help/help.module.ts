import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { HelpComponent }          from './help.component';
import { HelpRoutingModule }      from './help-routing.module';

import { SharedModule }           from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, HelpRoutingModule, SharedModule],
  declarations: [HelpComponent],
  exports: [HelpComponent]
})

export class HelpModule { }
