
import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';
import { AuthGuard }           from '../auth-guard.service';
import { DashboardComponent }  from './dashboard.component';
import { ProfileComponent }    from './profile/profile.component';
import { ListingsComponent }   from './listings/listings.component';
import { InboxComponent }      from './inbox/inbox.component';
import { FavouritesComponent } from './favourites/favourites.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full'},
          { path: 'profile', component: ProfileComponent },
          { path: 'listings', component: ListingsComponent },
          { path: 'inbox', component: InboxComponent },
          { path: 'favourites', component: FavouritesComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
