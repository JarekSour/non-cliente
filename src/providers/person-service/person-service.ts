import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonServiceProvider {

    constructor(public http: Http) { }

    ifExistAvatar() {
        return new Promise((resolve) => {
            if (localStorage.getItem("avatar_user") === null)
                resolve(false);
            else
                resolve(true);
        });
    }

    getAvatar(person) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post('http://nsbox.mybluemix.net/avatar', JSON.stringify(person), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

    updateProfile(profile) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.put('http://nsmiembro.mybluemix.net/update', JSON.stringify(profile), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }


    updatePlayerId(playerid) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.put('https://nsmiembro.mybluemix.net/ipdate', JSON.stringify(playerid), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

    getDataAgent(person) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post('https://nsagente.mybluemix.net/agent', JSON.stringify(person), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

}
