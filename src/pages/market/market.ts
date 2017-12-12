import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { MarketServiceProvider } from '../../providers/market-service/market-service';

@IonicPage()
@Component({
    selector: 'page-market',
    templateUrl: 'market.html',
})
export class MarketPage {
    jsonLista: any;
    newCantidad = {};
    newPrecio = {};
    total: any;
    btnComplete: boolean;
    rutAgente: any

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public marketService: MarketServiceProvider,
        public alertCtrl: AlertController,
        public navParams: NavParams) {
        this.total = 0;
        this.btnComplete = false;
    }

    ionViewDidLoad() {
        this.rutAgente = this.navParams.get('variable');

        this.marketService.getproductosMarket({ r: this.rutAgente }).then((resp) => {
            if (resp['data'] != false) {
                this.jsonLista = resp['data'];
                let data = resp['data'];

                for (let i = 0; data.length > i; i++) {
                    data[i]['Price'] = this.formatNumber(parseInt(data[i]['Price']));
                }
            }
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

    formatNumber(num) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        return num;
    }

    addCantidad(stock, producto, precio) {
        if (this.newCantidad[producto] == null) {
            this.newCantidad[producto] = 1;
            this.newPrecio[producto] = precio;
            this.total = this.sumarStringTotal(precio);
            this.btnComplete = true;
        } else {
            if (stock > this.newCantidad[producto]) {
                this.newCantidad[producto]++;
                this.newPrecio[producto] = this.sumarString(this.newPrecio[producto], precio);
                this.total = this.sumarStringTotal(precio);
                this.btnComplete = true;
            }
        }
    }

    restCantidad(producto, precio) {
        if (this.newCantidad[producto] != null) {
            if (this.newCantidad[producto] > 0) {
                this.newCantidad[producto]--;
                this.newPrecio[producto] = this.restarString(this.newPrecio[producto], precio);
                this.total = this.restarStringTotal(precio);
            }
        }
    }

    restarString(resta, precio) {
        let plus = parseInt(resta.replace(/\./g, ''));
        let price = parseInt(precio.replace(/\./g, ''));

        return this.formatNumber(plus - price);
    }

    restarStringTotal(precio) {
        let price = parseInt(precio.replace(/\./g, ''))
        let total = parseInt(this.total.replace(/\./g, ''));

        if (total - price == 0)
            this.btnComplete = false;

        return this.formatNumber(total - price);
    }

    sumarString(suma, precio) {
        let plus = parseInt(suma.replace(/\./g, ''));
        let price = parseInt(precio.replace(/\./g, ''));

        return this.formatNumber(plus + price);
    }

    sumarStringTotal(precio) {
        if (this.total !== 0) {
            let price = parseInt(precio.replace(/\./g, ''))
            let total = parseInt(this.total.replace(/\./g, ''));

            return this.formatNumber(total + price);
        } else {
            return precio;
        }
    }

    completePedido() {
        this.navCtrl.push('CartPage', {
            codigo: this.newCantidad,
            producto: this.jsonLista,
            total:this.total,
            rutAgente: this.rutAgente
        });
    }

}
