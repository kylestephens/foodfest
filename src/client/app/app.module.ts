import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { APP_BASE_HREF }        from '@angular/common';
import { HttpModule }           from '@angular/http';
import { AppComponent }         from './app.component';
import { AppRoutingModule }     from './app-routing.module';

// 3rd party
import { Ng2Webstorage }        from 'ng2-webstorage';
// 3rd party

import { HomeModule }           from './home/home.module';

import { SharedModule }         from './shared/shared.module';
import { ServicesModule }       from './services/services.module';
import { AuthGuard }            from './auth-guard.service';

@NgModule({

  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    Ng2Webstorage.forRoot({ prefix: 'foodfest', separator: '.' }),
    HomeModule,
    ServicesModule,
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
