import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MarketServiceProvider } from '../../providers/market-service/market-service';
import { LoadingController } from 'ionic-angular';
import { PersonServiceProvider } from '../../providers/person-service/person-service';

@IonicPage()
@Component({
    selector: 'page-history',
    templateUrl: 'history.html',
})
export class HistoryPage {
    json: any;
    credential = localStorage.getItem("credential_user");
    aux = JSON.parse(this.credential);
    loader: any;

    constructor(
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public personService: PersonServiceProvider,
        public marketService: MarketServiceProvider,
        public loadingCtrl: LoadingController) { }

    ionViewDidLoad() {
        this.presentLoading();
        this.marketService.getHistory({ r: this.aux.data.IdDocument }).then((response) => {
            if (response['data'] != false) {
                let data = response['data'];

                for (let i = 0; data.length > i; i++) {
                    if (data[i]['Resolution'] == 'Cancelado por Sistema') {
                        data[i]['Resolution'] = 'Cancelado por el sistema';
                        data[i]['Class'] = 'card-header-cancel';
                    } else if (data[i]['Resolution'] == 'Cancelado Agente') {
                        data[i]['Resolution'] = 'Cancelado por el agente';
                        data[i]['Class'] = 'card-header-cancel';
                    } else if (data[i]['Resolution'] == 'Cancelado Member') {
                        data[i]['Resolution'] = 'Cancelado por usuario';
                        data[i]['Class'] = 'card-header-cancel';
                    } else if (data[i]['Resolution'].includes('Completado')) {
                        data[i]['Resolution'] = 'Completado con éxito';
                        data[i]['Class'] = 'card-header-acepta';
                    }

                    this.personService.getDataAgent({ r: data[i]['Agent'] }).then((info) => {
                        data[i]['Nombre'] = info["data"]["Name"] + ' ' + info["data"]["LastName"]
                    })

                    data[i]['Total'] = this.formatNumber(parseInt(data[i]['Total']));
                }

                this.json = data;
                this.loader.dismiss();

            } else {
                this.loader.dismiss();
                this.json = null;
            }
        })
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Cargando...",
            duration: 3000
        });
        this.loader.present();
    }

    openComentario(comentario){
        let modal = this.modalCtrl.create('ModalComentarioPage', { c : comentario });
        modal.present();
    }

    formatNumber(num) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        return num;
    }
}
