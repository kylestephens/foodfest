import { NgModule } 					    from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { SharedModule }           from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent }     from './dashboard.component';
import { ProfileComponent }       from './profile/profile.component';
import { ListingsComponent }      from './listings/listings.component';
import { ListingsEditComponent }  from './listings/edit/listings-edit.component';
import { InboxComponent }         from './inbox/inbox.component';
import { InboxThreadComponent }   from './inbox/thread/inbox-thread.component';
import {
  SearchResultsCardModule
}                                 from '../searchResults/cardList/card/search-results-card.module';

import { FavouritesComponent }    from './favourites/favourites.component';

import { Ng2PaginationModule }    from 'ng2-pagination';

@NgModule({
  imports: [
    Ng2PaginationModule,
    SearchResultsCardModule,
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ListingsComponent,
    ListingsEditComponent,
    InboxComponent,
    InboxThreadComponent,
    FavouritesComponent
  ]
})

export class DashboardModule { }
