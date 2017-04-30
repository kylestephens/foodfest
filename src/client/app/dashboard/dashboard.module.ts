import { NgModule } 					    from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { SharedModule }           from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent }     from './dashboard.component';
import { ProfileComponent }       from './profile/profile.component';
import { ListingsComponent }      from './listings/listings.component';
import { InboxComponent }         from './inbox/inbox.component';
import { InboxThreadComponent }   from './inbox/thread/inbox-thread.component';
import { FavouritesComponent }    from './favourites/favourites.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ListingsComponent,
    InboxComponent,
    InboxThreadComponent,
    FavouritesComponent
  ]
})

export class DashboardModule { }
