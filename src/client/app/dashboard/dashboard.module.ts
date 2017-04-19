import { NgModule } 					    from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent }     from './dashboard.component';
import { ProfileComponent }       from './profile/profile.component';
import { ListingsComponent }      from './listings/listings.component';
import { InboxComponent }         from './inbox/inbox.component';
import { InboxThreadComponent }    from './inbox/thread/inbox-thread.component';
import { FavouritesComponent }    from './favourites/favourites.component';

import { InboxService }           from './inbox/inbox.service';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ListingsComponent,
    InboxComponent,
    InboxThreadComponent,
    FavouritesComponent
  ],
  providers: [
    InboxService
  ]
})

export class DashboardModule { }
