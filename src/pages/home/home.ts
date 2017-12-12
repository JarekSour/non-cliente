import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, ToastController, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import 'rxjs/add/operator/map';
import { MapServiceProvider } from '../../providers/map-service/map-service';

declare var google;

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    markerCluster: any;
    errorGPS: boolean;
    errorPermiso: boolean;
    interval: any;
    initmap: boolean;

    constructor(
        public platform: Platform,
        public splashScreen: SplashScreen,
        public navCtrl: NavController,
        public geolocation: Geolocation,
        public mapService: MapServiceProvider,
        public toastCtrl: ToastController,
        public menuCtrl: MenuController) {

        this.platform.ready().then(() => {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100)
        })

        this.errorGPS = false;
        this.errorPermiso = false;
        this.initmap = true;
    }

    ionViewDidLoad() {
        this.menuCtrl.enable(true, 'menuSlide');
        this.chkGPS();
    }

    chkGPS() {
        this.intervalMethod();
        this.interval = setInterval(() => {
            this.intervalMethod();
        }, 3000);
    }

    intervalMethod() {
        this.mapService.isLocationEnabled().then((response) => {
            if (response) {
                this.errorGPS = false;
                this.errorPermiso = false;
                if (this.initmap == true) {
                    this.iniciarMap();
                }
            } else {
                this.errorGPS = true;
            }
        }).catch((e) => {
            this.errorPermiso = true;
        });
    }

    iniciarMap() {
        this.initmap = false;

        this.geolocation.getCurrentPosition().then((resp) => {
            this.map = new google.maps.Map(this.mapElement.nativeElement, {
                zoom: 13,
                center: { lat: resp.coords.latitude, lng: resp.coords.longitude },
                animation: google.maps.Animation.DROP,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                mapTypeControl: false
            });

            var position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

            var myPosition = new google.maps.Marker({ position: position, title: 'Yo', icon: 'assets/my.png' });
            myPosition.setMap(this.map);

            this.addMarkers(resp.coords.latitude, resp.coords.longitude);

        }).catch((error) => {
            this.presentToast('Verifica tu conexión a internet');
        });
    }

    addMarkers(lat, lon) {

        this.mapService.getMarkets({ g: lat + ', ' + lon }).then((response) => {
            if (response['data'] != false) {

                let markers = response['data'].map((location) => {
                    let geo = location.Geocoordinate.split(',');

                    var position = new google.maps.LatLng(parseFloat(geo[0]), parseFloat(geo[1]));

                    let marca = new google.maps.Marker({
                        position: position,
                        label: "",
                        icon: 'assets/other.png',
                        id: location.Agent
                    });

                    google.maps.event.addListener(marca, 'click', (info) => {
                        this.navCtrl.push('MarketPage', {
                            variable: marca.id
                        });
                    });

                    return marca;
                });

                this.markerCluster = new MarkerClusterer(this.map, markers, { imagePath: 'assets/m' }, );
            } else {
                this.presentToast('Lamentablemente en estos momentos no hay agentes disponibles en su comuna');
            }
        }).catch((err) => {
            this.presentToast('Verifica tu conexión a internet');
        });
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
            dismissOnPageChange: true
        });

        toast.present();
    }
}
