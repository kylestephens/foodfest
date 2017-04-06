import { NgModule } 					    from '@angular/core';
import { CommonModule }           from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent }     from './dashboard.component';
import { ProfileComponent }       from './profile/profile.component';
import { ListingsComponent }      from './listings/listings.component';
import { InboxComponent }         from './inbox/inbox.component';
import { FavouritesComponent }    from './favourites/favourites.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ListingsComponent,
    InboxComponent,
    FavouritesComponent
  ]
})

export class DashboardModule { }
