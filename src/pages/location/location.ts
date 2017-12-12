import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
    selector: 'page-location',
    templateUrl: 'location.html',
})
export class LocationPage {

    autocompleteItems: any;
    autocomplete = { query: '' };
    acService: any;
    placesService: any;
    order: any;

    constructor(
        public navCtrl: NavController,
        public event: Events,
        public toastCtrl: ToastController,
        public navParams: NavParams) { }

    ionViewDidLoad() {
        this.autocomplete.query = this.navParams.get('variable');
        this.order = this.navParams.get('order');
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = {
            input: this.autocomplete.query,
            componentRestrictions: {}
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            self.autocompleteItems = [];
            predictions.forEach(function (prediction) {
                self.autocompleteItems.push(prediction);
            });
        });
    }

    aceptarLocation() {
        localStorage.setItem('location', this.autocomplete.query);
        this.event.publish('reloadLocation', this.autocomplete.query, this.order);
        this.navCtrl.pop();
    }

    chooseItem(item) {
        this.autocomplete.query = item.description
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 10000,
            position: 'bottom',
            dismissOnPageChange: true
        });

        toast.present();
    }

}
