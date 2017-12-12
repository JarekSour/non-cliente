import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {

    loading: any;
    regData = { n: '', l: '', r: '', e: '', p: '', t: '56', c: null };

    constructor(
        public navCtrl: NavController,
        public authService: AuthServiceProvider,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        public alertCtrl: AlertController) { }

    doSignup() {
        if (this.regData.c == null || this.regData.c == false) {
            this.presentToast('Debes aceptar los Terminos y condiciones');
        } else {
            if (this.regData.n.length < 3) {
                this.presentToast('Tu nombre debe contener al menos 3 letras');
            } else {
                if (this.regData.l.length < 3) {
                    this.presentToast('Tu apellido debe contener al menos 3 letras');
                } else {
                    if (this.regData.r.length < 8) {
                        this.presentToast('El rut ingresado no es válido');
                    } else {
                        if (this.validateEmail(this.regData.e) == false) {
                            this.presentToast('El correo electrónico ingresado no es válido');
                        } else {
                            if (this.regData.p.length < 5) {
                                this.presentToast('Tu contraseña debe contener al menos 5 caracteres');
                            } else {
                                if (this.regData.t.length < 11) {
                                    this.presentToast('Tu teléfono debe contener al menos 11 números');
                                } else {
                                    this.showLoader();
                                    this.authService.register(this.regData).then((result) => {

                                        if (result['data']) {
                                            this.showAlert();
                                        } else {
                                            switch (result['message']) {
                                                case 'This Document ID is already registered.':
                                                    this.presentToast('El RUT ingresado ya se encuentra en uso');
                                                    break;
                                                case 'This email is already registered.':
                                                    this.presentToast('El Correo electrónico ingresado ya se encuentra en uso');
                                                    break;
                                                default:
                                                    this.presentToast('Ups! ocurrio un error');
                                                    break;
                                            }
                                        }
                                        this.loading.dismiss();
                                    }, (err) => {
                                        this.loading.dismiss();
                                        this.presentToast(err);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    terminos() {
        this.navCtrl.push('TerminosPage');
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

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    showAlert() {
        let alert = this.alertCtrl.create({
            title: 'Felicidades',
            subTitle: 'Su cuenta ha sido creada exitosamente',
            buttons: [{
                text: 'Aceptar',
                handler: data => {
                    this.navCtrl.pop();
                }
            }]
        });
        alert.present();
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}
