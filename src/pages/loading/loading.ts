import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, MenuController } from 'ionic-angular';
import { MarketServiceProvider } from '../../providers/market-service/market-service';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
    selector: 'page-loading',
    templateUrl: 'loading.html',
})
export class LoadingPage {

    orderId: any;
    rutAgente: any;
    timeout: any;

    constructor(
        public navCtrl: NavController,
        public marketService: MarketServiceProvider,
        public alertCtrl: AlertController,
        private _OneSignal: OneSignal,
        public menuCtrl: MenuController,
        public toastCtrl: ToastController,
        public navParams: NavParams) { }

    ionViewDidLoad() {
        this.menuCtrl.enable(false, 'menuSlide');
        this.orderId = localStorage.getItem('orderId_user');
        this.rutAgente = this.navParams.get('rutAgente');

        this.timeout = setTimeout(() => {
            this.marketService.getOrdenDeCompra({ i: this.orderId }).then((res) => {
                if (res['data']["State"] == true)
                    if (res['data']["Deal"] == false) {
                        localStorage.removeItem('g');
                        localStorage.removeItem('orderId_user');
                        localStorage.removeItem('en_camino_user');

                        this._OneSignal.getIds().then((ids) => {
                            this.marketService.cancelarCompraSystem({ i: this.orderId, rs: 'Cancelado por Sistema', pi: ids['userId'] }).then((data) => {
                                this.navCtrl.setRoot('HomePage');
                            });
                        });
                    }
            });
        }, 60000);
    }


    cancelRequest() {

        let confirm = this.alertCtrl.create({
            title: 'Alerta',
            message: '¿Estas seguro que deseas cancelar el pedido?',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        clearTimeout(this.timeout);
                        this.marketService.getPlayerIdAgent({ r: this.rutAgente }).then((data) => {
                            this.marketService.cancelarCompra({ i: this.orderId, rs: 'Cancelado Member', pi: data['data']['Player_ids'] }).then((res) => {
                                if (res['data'] == true) {
                                    localStorage.removeItem('g');
                                    localStorage.removeItem('orderId_user');
                                    localStorage.removeItem('en_camino_user');
                                    let alert = this.alertCtrl.create({
                                        title: 'Alerta',
                                        subTitle: 'Tu pedido fue cancelado exitosamente',
                                        enableBackdropDismiss: false,
                                        buttons: [
                                            {
                                                text: 'Aceptar',
                                                handler: data => {
                                                    this.navCtrl.setRoot('HomePage');
                                                }
                                            }
                                        ]
                                    });
                                    alert.present();
                                } else {
                                    this.presentToast('Ups! ocurrio un error');
                                }
                            })
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    handler: () => { }
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
