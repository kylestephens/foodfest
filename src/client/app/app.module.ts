import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { APP_BASE_HREF }      from '@angular/common';
import { HttpModule }         from '@angular/http';
import { AppComponent }       from './app.component';
import { AppRoutingModule }   from './app-routing.module';

import { Ng2Webstorage }       from 'ng2-webstorage';

import { AboutModule }        from './about/about.module';
import { CommercialModule }   from './commercial/commercial.module';
import { HomeModule }         from './home/home.module';
import { ListingModule }      from './listing/listing.module';
import { SharedModule }       from './shared/shared.module';
import { ServicesModule }     from './services/services.module';

@NgModule({

  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    Ng2Webstorage.forRoot({ prefix: 'foodfest', separator: '.' }),
    AboutModule,
    CommercialModule,
    HomeModule,
    ListingModule,
    SharedModule.forRoot(),
    ServicesModule
  ],

  declarations: [AppComponent],

  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],

  bootstrap: [AppComponent]

})

export class AppModule { }
