import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { MarketServiceProvider } from '../../providers/market-service/market-service';

@IonicPage()
@Component({
    selector: 'page-modal-comentario',
    templateUrl: 'modal-comentario.html',
})
export class ModalComentarioPage {
    txtComentario: any;
    idOrden = this.navParams.get('c');
    lleva: any;
    loading: any;

    constructor(
        public navCtrl: NavController,
        public marketService: MarketServiceProvider,
        private toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public viewCtrl: ViewController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams) {
        this.lleva = 0;
    }

    save() {
        if (this.txtComentario.trim().length > 140) {
            this.presentToast('Tu comentario excede la cantidad máxima de caracteres permitida');
        } else if (this.txtComentario.trim().length < 10) {
            this.presentToast('Tu comentario debe tener al menos 10 caracteres');
        } else {

            this.presentloader();
            this.marketService.saveComentario({ i: this.idOrden, c: this.txtComentario.trim() }).then((data) => {
                if (data["data"]) {
                    let alert = this.alertCtrl.create({
                        title: 'Felicidades',
                        message: 'Hemos recibido tu comentario, gracias!',
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'Aceptar',
                            handler: () => {
                                this.loading.dismiss();
                                this.navCtrl.pop();
                            }
                        }]
                    });
                    alert.present();
                } else {
                    this.loading.dismiss();
                    this.presentToast('Ups, ocurrio un error, reintenta mas tarde');
                }
            });
        }
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    caracteresLleva() {
        this.lleva = this.txtComentario.trim().length;
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

    presentloader() {
        this.loading = this.loadingCtrl.create({
            content: 'Cargando...'
        });

        this.loading.present();
    }

}
