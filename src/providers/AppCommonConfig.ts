import { Injectable } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@Injectable()
export class AppCommonConfig {
  // App Url's
  public API_URL: string = "http://dev.onzup.com/api/";

  // App Components
  public mLoader;
  public mToast;

  // App User Data
  public userPermission: any;
  public clientPermission: any;

  constructor(
    public platform: Platform,
    public network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage) {
  }

  showLoading(message) {
    this.mLoader = this.loadingCtrl.create({
      content: message
      // spinner: 'hide',
      // duration: 3000,
      // showBackdrop: true,
      // enableBackdropDismiss: true,
      // dismissOnPageChange: true
    });

    this.mLoader.onDidDismiss(() => {
      // console.log('Dismissed loading');
    });

    this.mLoader.present();
  }

  hideLoading() {
    this.mLoader.dismiss();
  }

  showToast(msg, position, duration, isShowCloseBtn, closeButtonText, hideOnPageChange) {
    if (isShowCloseBtn) {
      this.mToast = this.toastCtrl.create({
        message: msg,
        position: position,
        duration: duration,
        showCloseButton: isShowCloseBtn,
        closeButtonText: closeButtonText,
        dismissOnPageChange: hideOnPageChange
      });
    } else {
      this.mToast = this.toastCtrl.create({
        message: msg,
        position: position,
        duration: duration,
        dismissOnPageChange: hideOnPageChange
      });
    }

    this.mToast.present();
  }

  showAlertMsg(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });

    alert.present();
  }

  hideToast() {
    this.mToast.dismiss();
  }

  isRunOnMobileDevice() {
    return this.platform.is('mobile') ? true : false;
  }

  hasConnection() {
    if (this.isRunOnMobileDevice()) {
      if (this.network.type == "unknown" || this.network.type == "none") {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  checkLogin() {
    return new Promise(resolve => {
      this.storage.get('userData').then((val) => {
        if (val != null) {
          resolve(val.success);
        } else {
          resolve(false);
        }
      });
    });
  }

  setDataInStorage(key, value) {
    this.storage.set(key, value);
  }

  getDataFromStorage(key) {
    return new Promise(resolve => {
      this.storage.get(key).then((value) => {
        if (value != null) {
          resolve(value);
        } else {
          resolve(false);
        }
      });
    });
  }
}
