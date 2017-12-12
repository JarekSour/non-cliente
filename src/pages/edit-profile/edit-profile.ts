import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController,  } from 'ionic-angular';
import { PersonServiceProvider } from '../../providers/person-service/person-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
    credential = localStorage.getItem("credential_user");
    pass = localStorage.getItem("pass_user");
    aux = JSON.parse(this.credential);
    toUpdate = {
        n: this.aux.data.Name,
        l: this.aux.data.LastName,
        r: this.aux.data.IdDocument,
        e: this.aux.data.Email,
        p: this.pass,
        t: this.aux.data.Phone
    };
    product = { x: '', xx: '', xxx: '' };
    isNameorLast: boolean;
    isCorreo: boolean;
    isTelefono: boolean;
    isPass: boolean;
    inputText: any;
    inputText2: any;
    inputText3: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private toastCtrl: ToastController,
        public personService: PersonServiceProvider,
        public authService: AuthServiceProvider,
        public event: Events) { }

    ionViewDidLoad() {
        let variable = this.navParams.get('variable');
        switch (variable) {
            case 'nombre':
                this.inputText = 'Nombre'
                this.isNameorLast = true;
                this.product.x = this.aux.data.Name
                break;
            case 'apellido':
                this.inputText = 'Apellido'
                this.isNameorLast = true;
                this.product.x = this.aux.data.LastName
                break;
            case 'correo':
                this.inputText = 'Correo electrónico'
                this.isCorreo = true;
                this.product.x = this.aux.data.Email
                break;
            case 'telefono':
                this.inputText = 'Teléfono'
                this.isTelefono = true;
                this.product.x = this.aux.data.Phone
                break;
            case 'pass':
                this.inputText = 'Ingrese su contraseña actual';
                this.inputText2 = 'Ingrese su nueva contraseña';
                this.inputText3 = 'Reingrese su nueva contraseña';
                this.isPass = true;
                break;
        }
    }

    editProfile() {
        let variable = this.navParams.get('variable');
        switch (variable) {
            case 'nombre':
                if (this.product.x.length > 2) {
                    this.toUpdate.n = this.product.x
                    this.personService.updateProfile(this.toUpdate).then((res) => {
                        this.updateProfileLocalStorage(this.toUpdate.e);
                    }, (err) => {
                        this.presentToast('Ups! ocurrio un error');
                    });
                } else {
                    this.presentToast('El nombre debe contener al menos 3 letras');
                }
                break;
            case 'apellido':
                if (this.product.x.length > 2) {
                    this.toUpdate.l = this.product.x
                    this.personService.updateProfile(this.toUpdate).then((res) => {
                        this.updateProfileLocalStorage(this.toUpdate.e);
                    }, (err) => {
                        this.presentToast('Ups! ocurrio un error');
                    });
                } else {
                    this.presentToast('El apellido debe contener al menos 3 letras');
                }
                break;
            case 'correo':
                if (this.validateEmail(this.product.x)) {
                    this.toUpdate.e = this.product.x
                    this.personService.updateProfile(this.toUpdate).then((res) => {
                        this.updateProfileLocalStorage(this.toUpdate.e);
                    }, (err) => {
                        this.presentToast('Ups! ocurrio un error');
                    });
                } else {
                    this.presentToast('El correo electrónico ingresado no es válido');
                }
                break;
            case 'telefono':
                if (this.product.x.length > 7) {
                    this.toUpdate.t = this.product.x
                    this.personService.updateProfile(this.toUpdate).then((res) => {
                        this.updateProfileLocalStorage(this.toUpdate.e);
                    }, (err) => {
                        this.presentToast('Ups! ocurrio un error');
                    });
                } else {
                    this.presentToast('El teléfono debe contener al menos 8 números');
                }
                break;
            case 'pass':
                if (this.pass != this.product.x) {
                    this.presentToast('Tu actual contraseña es incorrecta');
                } else {
                    if (this.product.xx != this.product.xxx) {
                        this.presentToast('Las nuevas contraseñas deben coincidir');
                    } else {
                        if (this.product.xx.length < 5) {
                            this.presentToast('Tu nueva contraseña debe contener al menos 5 caracteres');
                        } else {
                            this.toUpdate.p = this.product.xx;
                            this.personService.updateProfile(this.toUpdate).then((res) => {
                                localStorage.setItem('pass_user', this.toUpdate.p);
                                this.navCtrl.pop();
                            }, (err) => {
                                this.presentToast('Ups! ocurrio un error');
                            });
                        }
                    }

                }
                break;
        }
    }

    updateProfileLocalStorage(email) {
        this.authService.login({ e: email, p: localStorage.getItem('pass_user')}).then((result) => {
            if (result['message'] == 'Authorize') {
                localStorage.setItem('credential_user', JSON.stringify(result));
            }

            this.event.publish('reloadProfile');
            this.navCtrl.pop();
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

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}
