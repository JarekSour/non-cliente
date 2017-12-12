import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Diagnostic } from '@ionic-native/diagnostic';

@Injectable()
export class MapServiceProvider {

    constructor(
        public http: Http,
        public diag: Diagnostic) { }

    isLocationEnabled() {
        return new Promise((resolve) => {
            this.diag.isLocationEnabled().then((isAvailable) => {
                if (isAvailable) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    getMarkets(geocoordinate) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post('http://nstrack.mybluemix.net/list', JSON.stringify(geocoordinate), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

}
