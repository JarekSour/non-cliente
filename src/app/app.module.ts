import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { OneSignal } from '@ionic-native/onesignal';

import { MyApp } from './app.component';;

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { MapServiceProvider } from '../providers/map-service/map-service';
import { PersonServiceProvider } from '../providers/person-service/person-service';
import { MarketServiceProvider } from '../providers/market-service/market-service';

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        Geolocation,
        Network,
        AuthServiceProvider,
        GoogleMaps,
        Diagnostic,
        MapServiceProvider,
        PersonServiceProvider,
        MarketServiceProvider,
        NativeGeocoder,
        OneSignal
    ]
})
export class AppModule { }
