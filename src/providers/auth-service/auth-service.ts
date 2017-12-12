import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthServiceProvider {

    constructor(public http: Http) {

    }

    isLogged() {
        return new Promise((resolve) => {
            if (localStorage.getItem("credential_user") === null)
                resolve(false);
            else
                resolve(true);
        });
    }

    login(credentials) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post('http://nsmiembro.mybluemix.net/auth', JSON.stringify(credentials), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

    register(data) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post('http://nsmiembro.mybluemix.net/post', JSON.stringify(data), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

    logout() {
        localStorage.removeItem('credential_user');
        localStorage.removeItem('pass_user');
    }

}
