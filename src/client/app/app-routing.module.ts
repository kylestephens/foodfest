import { NgModule }               from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
  { path: 'commercial', loadChildren: 'app/commercial/commercial.module#CommercialModule' },
  { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
  { path: 'help', loadChildren: 'app/help/help.module#HelpModule' },
  { path: 'signin', loadChildren: 'app/signin/signin.module#SigninModule' },
  { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule' },
  { path: 'search-results', loadChildren: 'app/searchResults/search-results.module#SearchResultsModule' },
  { path: 'list-with-us', loadChildren: 'app/listing/listing.module#ListingModule' },
  { path: 'privacy', loadChildren: 'app/privacy/privacy.module#PrivacyModule' },
  { path: 'vendor', loadChildren: 'app/vendor/vendor.module#VendorModule' },
  { path: 'vendor/:id', loadChildren: 'app/vendor/vendor.module#VendorModule' },
  { path: 'markets', loadChildren: 'app/markets/markets.module#MarketsModule' },
  { path: 'markets/create-market', loadChildren: 'app/markets/create/create-market.module#CreateMarketModule' },
  { path: 'complete/:ref', loadChildren: 'app/listingComplete/listing-complete.module#ListingCompleteModule' },
  { path: 'forgot-password', loadChildren: 'app/forgotPassword/forgot-password.module#ForgotPasswordModule' },
  { path: 'reset-password', loadChildren: 'app/resetPassword/reset-password.module#ResetPasswordModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  // lazy loaded modules
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
