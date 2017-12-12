import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import { MarketServiceProvider } from '../../providers/market-service/market-service';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
})
export class CartPage {

    credential = localStorage.getItem("credential_user");
    credentialJson = JSON.parse(this.credential);
    json = [];
    total: any;
    order = { r: '', m: '', g: '', a: '', p: [], q: 0, t: 0, pi: '', d: false };
    loader: any;

    constructor(
        public marketService: MarketServiceProvider,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public event: Events,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public navParams: NavParams) {

        let codigo = this.navParams.get('codigo');
        let producto = this.navParams.get('producto');
        this.total = this.navParams.get('total');
        this.order.r = this.navParams.get('rutAgente');
        this.order.m = this.credentialJson.data.IdDocument;
        this.order.t = parseInt(this.total.replace(/\./g, ''));

        for (let compra in codigo) {
            for (let lista of producto) {
                if (lista.Product == compra && codigo[compra] > 0) {
                    this.json.push({ 'brand': lista['Brand'], 'name': lista['Name'], 'prize': lista['Price'], 'count': codigo[compra], 'suma': this.sumarString(lista['Price'], codigo[compra]) });
                    this.order.q = this.order.q + codigo[compra];
                    this.order.p.push({ 'producto': compra, 'cantidad': codigo[compra] })
                }
            }
        }
    }

    ionViewDidEnter() {
        this.event.subscribe('reloadLocation', (locat, orde) => {
            if (localStorage.getItem('location') !== null) {
                localStorage.removeItem('location');

                this.order.p = orde;
                this.presentLoading();
                this.nativeGeocoder.forwardGeocode(locat)
                    .then((coordinates: NativeGeocoderForwardResult) => {
                        this.order.g = coordinates.latitude + ' , ' + coordinates.longitude;

                        this.loader.dismiss();
                        let prompt = this.alertCtrl.create({
                            enableBackdropDismiss: false,
                            title: 'Confirmar dirección',
                            message: "Verifica si la dirección de entrega es la correcta :<br><br>" + locat + '<br><br>¿Estás seguro que deseas completar el pedido?',
                            buttons: [
                                {
                                    text: 'Aceptar',
                                    handler: () => {
                                        this.presentLoading();
                                        this.order.a = locat;

                                        this.marketService.getPlayerIdAgent({ r: this.order.r }).then((data) => {
                                            this.order.pi = data['data']['Player_ids'];
                                            this.order.d = true;
                                            this.marketService.confirmarCompra(this.order).then((response) => {
                                                //if si tienda esta disponible
                                                if (response['data'] == false) {
                                                    this.loader.dismiss();
                                                    let prom = this.alertCtrl.create({
                                                        enableBackdropDismiss: false,
                                                        title: 'Lo sentimos...',
                                                        message: 'La tienda del agente fue desactivada',
                                                        buttons: [{
                                                            text: 'Aceptar',
                                                            handler: () => {
                                                                this.navCtrl.setRoot('HomePage');
                                                            }
                                                        }]
                                                    });
                                                    prom.present();
                                                } else {
                                                    localStorage.setItem('orderId_user', response['data']);
                                                    this.navCtrl.setRoot('LoadingPage', { rutAgente: this.order.r });
                                                }
                                            });
                                        });
                                    }
                                },
                                {
                                    text: 'Cancelar',
                                    handler: () => {

                                    }
                                }
                            ]
                        });
                        prompt.present();

                    }).catch((error: any) => {
                        this.loader.dismiss();
                        this.presentToast(JSON.stringify(error));
                    });
            }
        });
    }

    completePedido() {
        let prompt = this.alertCtrl.create({
            enableBackdropDismiss: false,
            title: 'Escoge la forma de entrega',
            message: "",
            buttons: [
                {
                    text: 'Despacho a domicilio',
                    handler: () => {
                        this.geolocation.getCurrentPosition().then((resp) => {
                            this.order.g = resp.coords.latitude + ' , ' + resp.coords.longitude

                            this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude).then((result: NativeGeocoderReverseResult) => {

                                this.navCtrl.push('LocationPage', {
                                    variable: result['thoroughfare'] + ' ' + result['subThoroughfare'] + ', ' + result['locality'],
                                    order: this.order.p
                                });

                            }).catch((error: any) => {
                                this.presentToast(JSON.stringify(error));
                            });
                        });
                    }
                },
                {
                    text: 'Retirar en local',
                    handler: () => {
                        let alert = this.alertCtrl.create({
                            enableBackdropDismiss: false,
                            title: '',
                            message: "Estas a punto de finalizar tu pedido, estas seguro?",
                            buttons: [
                                {
                                    text: 'Aceptar',
                                    handler: () => {
                                        this.geolocation.getCurrentPosition().then((resp) => {
                                            this.order.g = resp.coords.latitude + ' , ' + resp.coords.longitude

                                            this.marketService.getPlayerIdAgent({ r: this.order.r }).then((data) => {
                                                this.order.pi = data['data']['Player_ids'];
                                                this.order.d = false;
                                                this.marketService.confirmarCompra(this.order).then((response) => {
                                                    //if si tienda esta disponible
                                                    if (response['data'] == false) {
                                                        this.loader.dismiss();
                                                        let prom = this.alertCtrl.create({
                                                            enableBackdropDismiss: false,
                                                            title: 'Lo sentimos...',
                                                            message: 'La tienda del agente fue desactivada',
                                                            buttons: [{
                                                                text: 'Aceptar',
                                                                handler: () => {
                                                                    this.navCtrl.setRoot('HomePage');
                                                                }
                                                            }]
                                                        });
                                                        prom.present();
                                                    } else {
                                                        localStorage.setItem('orderId_user', response['data']);
                                                        this.navCtrl.setRoot('LoadingPage', { rutAgente: this.order.r });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                },
                                {
                                    text: 'Cancelar',
                                    handler: () => {

                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                }
            ]
        });
        prompt.present();

    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
        });

        toast.present();
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Cargando...",
            duration: 3000,
            enableBackdropDismiss: false
        });
        this.loader.present();
    }

    sumarString(precio, cantidad) {
        let price = parseInt(precio.replace(/\./g, ''))
        return this.formatNumber(cantidad * price);
    }

    formatNumber(num) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        return num;
    }

}
