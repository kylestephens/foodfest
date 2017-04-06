import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { APP_BASE_HREF }        from '@angular/common';
import { HttpModule }           from '@angular/http';
import { AppComponent }         from './app.component';
import { AppRoutingModule }     from './app-routing.module';

// 3rd party
import { Ng2Webstorage }        from 'ng2-webstorage';
// 3rd party

import { AboutModule }          from './about/about.module';
import { CommercialModule }     from './commercial/commercial.module';
import { DashboardModule }      from './dashboard/dashboard.module';
import { HelpModule }           from './help/help.module';
import { HomeModule }           from './home/home.module';
import { ListingModule }        from './listing/listing.module';
import { SigninModule }         from './signin/signin.module';
import { SignupModule }         from './signup/signup.module';
import { SharedModule }         from './shared/shared.module';
import { SearchResultsModule }  from './searchResults/search-results.module';
import { ServicesModule }       from './services/services.module';

import { AuthGuard }            from './auth-guard.service';

@NgModule({

  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    Ng2Webstorage.forRoot({ prefix: 'foodfest', separator: '.' }),
    AboutModule,
    CommercialModule,
    DashboardModule,
    HelpModule,
    HomeModule,
    ListingModule,
    SearchResultsModule,
    ServicesModule,
    SigninModule,
    SignupModule,
    SharedModule.forRoot()
  ],

  declarations: [AppComponent],

  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    AuthGuard
  ],

  bootstrap: [AppComponent]

})

export class AppModule { }
