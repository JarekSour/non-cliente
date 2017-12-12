import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { PersonServiceProvider } from '../../providers/person-service/person-service';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    loading: any;
    credential = localStorage.getItem("credential_user");
    aux = JSON.parse(this.credential);
    rut: any;
    nombre: any;
    apellido: any;
    correo: any;
    telefono: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private toastCtrl: ToastController,
        public event: Events,
        public personService: PersonServiceProvider ) { }

    ionViewDidLoad() {
        this.rut = this.aux.data.IdDocument;
        this.nombre = this.aux.data.Name;
        this.apellido = this.aux.data.LastName;
        this.correo = this.aux.data.Email;
        this.telefono = this.aux.data.Phone;
    }

    ionViewDidEnter() {
        this.event.subscribe('reloadProfile', () => {
            let credentialAux = localStorage.getItem("credential_user");
            let auxAux = JSON.parse(credentialAux);
            this.rut = auxAux.data.IdDocument;
            this.nombre = auxAux.data.Name;
            this.apellido = auxAux.data.LastName;
            this.correo = auxAux.data.Email;
            this.telefono = auxAux.data.Phone;
            this.event.publish('user:update');
        });
    }

    updateProfile(variable) {
        switch (variable) {
            case 'nombre':
                this.navCtrl.push('EditProfilePage', {
                    variable: variable
                });
                break;
            case 'apellido':
                this.navCtrl.push('EditProfilePage', {
                    variable: variable
                });
                break;
            case 'correo':
                this.navCtrl.push('EditProfilePage', {
                    variable: variable
                });
                break;
            case 'telefono':
                this.navCtrl.push('EditProfilePage', {
                    variable: variable
                });
                break;
            case 'pass':
                this.navCtrl.push('EditProfilePage', {
                    variable: variable
                });
                break;
        }
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

}
