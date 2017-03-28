import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ServicesModule } from '../services/services.module';

@NgModule({
  imports: [HomeRoutingModule, SharedModule, ServicesModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule { }
