import { NgModule, ModuleWithProviders }  from '@angular/core';
import { CapitalizePipe }                 from './capitalize.pipe';

@NgModule({
  declarations: [
   CapitalizePipe
  ],
  exports: [
   CapitalizePipe
  ]
})

export class HelpersModule { }
