import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { PersonServiceProvider } from '../../providers/person-service/person-service';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    loading: any;
    loginData = { e: '', p: '' };

    constructor(
        public platform: Platform,
        public splashScreen: SplashScreen,
        public navCtrl: NavController,
        public navParams: NavParams,
        public authService: AuthServiceProvider,
        public loadingCtrl: LoadingController,
        private _OneSignal: OneSignal,
        private toastCtrl: ToastController,
        public personService: PersonServiceProvider,
        public menuCtrl: MenuController) {
        this.platform.ready().then(() => {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100)
        })
    }

    ionViewDidLoad() {
        this.menuCtrl.enable(false, 'menuSlide');
    }

    doLogin() {
        this.showLoader();
        this.authService.login(this.loginData).then((result) => {
            if (result['message'] == 'Authorize') {
                this._OneSignal.getIds().then((ids) => {
                    this.presentToast(JSON.stringify(ids));
                    localStorage.setItem('pass_user', this.loginData.p);
                    localStorage.setItem('credential_user', JSON.stringify(result));
                    let credential = localStorage.getItem("credential_user");
                    let aux = JSON.parse(credential);

                    this.personService.updatePlayerId({ r: aux.data.IdDocument, pi: ids['userId'] }).then(() => {
                        if (localStorage.getItem("orderId_user") === null)
                            this.navCtrl.setRoot('HomePage');
                        else
                            this.navCtrl.setRoot('LoadingPage');
                    });
                });
            } else {
                this.presentToast('Correo electrónico o contraseña incorrecta');
            }
            this.loading.dismiss();
        }, (err) => {
            this.loading.dismiss();
            this.presentToast('Verifica tu conexión a internet');
        });
    }

    register() {
        this.navCtrl.push('RegisterPage');
    }

    showLoader() {
        this.loading = this.loadingCtrl.create({
            content: 'Verificando datos...'
        });

        this.loading.present();
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
