import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    _name: any;
    _lastname: any;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public event: Events,
        private _OneSignal: OneSignal,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public splashScreen: SplashScreen,
        public auth: AuthServiceProvider) {

        this.event.subscribe('user:update', () => {
            let credential = localStorage.getItem("credential_user");
            let aux = JSON.parse(credential);
            this._name = aux.data.Name;
            this._lastname = aux.data.LastName;
        });

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this._OneSignal.startInit('f714f540-6750-4d60-bff6-4af7ed15150d', 'AIzaSyCxrm5GRwRusy6WILr5hRxD2o2FKMc98As');
            this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.Notification);
            this._OneSignal.setSubscription(true);
            this._OneSignal.handleNotificationOpened().subscribe((data) => {
                if (data['notification']['payload']['additionalData']['Status'] == false) {
                    localStorage.removeItem('orderId_user');
                    localStorage.removeItem('en_camino_user');
                    let credential = localStorage.getItem("credential_user");
                    let aux = JSON.parse(credential);
                    this._name = aux.data.Name;
                    this._lastname = aux.data.LastName;
                    this.nav.setRoot('HomePage');
                } else {
                    if (data['notification']['payload']['additionalData']['Completed'] == true) {
                        localStorage.removeItem('orderId_user');
                        localStorage.removeItem('en_camino_user');
                        localStorage.removeItem('g');
                        let credential = localStorage.getItem("credential_user");
                        let aux = JSON.parse(credential);
                        this._name = aux.data.Name;
                        this._lastname = aux.data.LastName;
                        this.nav.setRoot('HomePage');
                    } else {
                        localStorage.setItem('en_camino_user', 'true');
                        localStorage.setItem('g', data['notification']['payload']['additionalData']['g']);
                        this.nav.setRoot('MapPage');
                    }
                }
            });
            this._OneSignal.endInit();

            this.auth.isLogged().then((isloggedIn) => {
                if (isloggedIn) {
                    if (localStorage.getItem("orderId_user") === null) {
                        let credential = localStorage.getItem("credential_user");
                        let aux = JSON.parse(credential);
                        this._name = aux.data.Name;
                        this._lastname = aux.data.LastName;
                        this.rootPage = 'HomePage';
                    } else {
                        if (localStorage.getItem('en_camino_user') === null) {
                            this.rootPage = 'LoadingPage';
                        } else {
                            this.rootPage = 'MapPage';
                        }
                    }
                } else {
                    this.rootPage = 'LoginPage';
                }
            });
        });
    }

    goToPage(page) {
        switch (page) {
            case 'home':
                //this.nav.push(HomePage);
                break;
            case 'history':
                this.nav.push('HistoryPage');
                break;
            case 'profile':
                this.nav.push('ProfilePage');
                break;
            case 'terminos':
                this.nav.push('TerminosPage');
                break;
            default:
                break;
        }
    }

    closeSession() {
        let confirm = this.alertCtrl.create({
            title: 'Cerrar sesión',
            message: '¿Estás seguro que deseas cerrar la sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.auth.logout();
                        this.rootPage = 'LoginPage';
                    }
                }
            ]
        });
        confirm.present();
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
        });

        toast.present();
    }
}
