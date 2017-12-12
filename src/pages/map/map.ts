import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, MenuController, AlertController, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { MarketServiceProvider } from '../../providers/market-service/market-service';
import { PersonServiceProvider } from '../../providers/person-service/person-service';

declare var google;

@IonicPage()
@Component({
	selector: 'page-map',
	templateUrl: 'map.html',
})
export class MapPage {
	@ViewChild('map') mapElement: ElementRef;
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	orderId: any;
	map: any;
	errorGPS: boolean;
	errorPermiso: boolean;
	initmap: boolean;
	interval: any;
	position: any;
	destino: any;
	photo: any;
	name: any;
	rutAgente: any;

	constructor(
		public platform: Platform,
		public splashScreen: SplashScreen,
		public navCtrl: NavController,
		public menuCtrl: MenuController,
		public toastCtrl: ToastController,
		public marketService: MarketServiceProvider,
		public personService: PersonServiceProvider,
		public alertCtrl: AlertController,
		public geolocation: Geolocation,
		public diag: Diagnostic,
		public navParams: NavParams) {

		this.platform.ready().then(() => {
			setTimeout(() => {
				this.splashScreen.hide();
			}, 100)
		})
		this.errorGPS = false;
		this.errorPermiso = false;
		this.initmap = true;
	}

	ionViewDidLoad() {
		this.menuCtrl.enable(false, 'menuSlide');
		this.chkGps();
	}

	chkGps() {
		this.interval = setInterval(() => {
			this.diag.isLocationEnabled().then((isAvailable) => {
				if (isAvailable) {
					this.errorGPS = false;
					this.errorPermiso = false;
					if (this.initmap == true) {
						this.iniciarMap();
					}
				} else {
					this.presentToast('Activa tu GPS');
				}
			}).catch((e) => {
				this.errorPermiso = true;
			});
		}, 3000);
	}

	iniciarMap() {
		this.orderId = localStorage.getItem("orderId_user");
		this.initmap = false;

		this.marketService.getOrdenDeCompra({ i: this.orderId }).then((data) => {
			this.rutAgente = data['data']['Agent'];

			this.personService.getDataAgent({ r: this.rutAgente }).then((res) => {
				this.name = res['data']['Name'] + ' ' + res['data']['LastName'];
			})
			this.personService.getAvatar({ r: this.rutAgente, c: 'Avatar' }).then((res) => {
				if (res['data'] != false)
					this.photo = res['data'];
			})
		});

		this.geolocation.getCurrentPosition().then((resp) => {
			this.map = new google.maps.Map(this.mapElement.nativeElement, {
				zoom: 13,
				center: { lat: resp.coords.latitude, lng: resp.coords.longitude },
				animation: google.maps.Animation.DROP,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				streetViewControl: false,
				mapTypeControl: false
			});

			let aux = localStorage.getItem('g').split(',');
			this.destino = new google.maps.LatLng(parseFloat(aux[0]), parseFloat(aux[1]));
			this.position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

			this.directionsDisplay.setMap(this.map);

			this.calculateAndDisplayRoute(this.position);

		}).catch((error) => {
			this.presentToast('Ups! ocurrio un error (101)');
		});
	}

	calculateAndDisplayRoute(myPosition) {
		this.directionsService.route({
			origin: this.destino,
			destination: myPosition,
			travelMode: 'DRIVING'
		}, (response, status) => {
			if (status === 'OK') {
				this.directionsDisplay.setDirections(response);
			} else {
				this.presentToast('Ups! ' + status);
			}
		});
	}

	cancelarPedido() {
		let confirm = this.alertCtrl.create({
			title: 'Alerta',
			message: '¿Estas seguro que deseas cancelar el pedido?',
			enableBackdropDismiss: false,
			buttons: [
				{
					text: 'Aceptar',
					handler: () => {
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
			dismissOnPageChange: true
		});

		toast.present();
	}

}
