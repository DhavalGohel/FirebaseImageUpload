import { Injectable } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class AppCommonConfig {
  // App Url's
  public API_URL: string = "http://dev.onzup.com/api/";
  public emailPattern = /^[_A-Za-z0-9/.]+([_A-Za-z0-9-/+/-/?/*/=///^/!/#/$/%/'/`/{/}/|/~/;]+)*@[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*(\.[A-Za-z]{2,})$/;
  // App Components
  public mLoader;
  public mToast;

  // App User Data
  public userPermission: any;
  public clientPermission: any;
  public mUserEmail: string = "";
  public mUserMobileNo: string = "";
  public mUserName: string = "";
  public mUserData: any;

  constructor(
    public platform: Platform,
    public network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private toast: Toast) {
    //  this.setUserPermissions();
    //  this.setUserdata();
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

  // Local Toast
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

  hideToast() {
    this.mToast.dismiss();
  }

  // Native Plugin Toast

  showNativeToast(msg, position, duration) {
    // this.toast.show('I'm a toast', '5000', 'center').subscribe(
    //   toast => {
    //     console.log(toast);
    //   }
    //   );
  }

  hideNativeToast() {
    this.mToast.dismiss();
  }

  showAlertMsg(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });

    alert.present();
  }

  isRunOnMobileDevice() {
    return this.platform.is('mobile') ? true : false;
  }

  isRunOnAndroidDevice() {
    return this.platform.is('android') ? true : false;
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
      this.storage.get("userData").then((val) => {
        if (val != null) {
          resolve(val);
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

  clearLocalStorage() {
    this.storage.clear();
  }

  validateEmail(email) {
    if (this.emailPattern.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  setUserPermissions() {
    this.storage.get('userData').then((val) => {
      if (val != null) {
        if (val.user != null && val.user.roles[0]) {
          if (val.user.roles[0].permissions != null) {
            this.userPermission = val.user.roles[0].permissions;
          }

          if (val.user.roles[0].client_permissions != null) {
            this.clientPermission = val.user.roles[0].client_permissions;
          }

          console.log(this.userPermission);
          console.log(this.clientPermission);
        }
      }
    });
  }

  // Get user all permission by name

  getUserPermissionByName(permissionName) {
    if (permissionName != null && permissionName != "") {
      if (this.userPermission != null) {
        for (let i = 0; i < Object.keys(this.userPermission[permissionName]).length; i++) {
          console.log(this.userPermission[permissionName][i]);
        }
      }
    }
  }

  // Check for User has permission by name

  hasUserPermissionByName(permissionName, permissionType) {
    if (permissionName != null && permissionName != "" && permissionType != null && permissionType != "") {
      if (this.userPermission != null && Object.keys(this.userPermission).length != 0) {
        for (let i = 0; i < Object.keys(this.userPermission[permissionName]).length; i++) {
          console.log(this.userPermission[permissionName][i].permission_name + " : " + this.userPermission[permissionName][i].permission_value);
          if (this.userPermission[permissionName][i].permission_name == permissionName + "." + permissionType) {
            return this.userPermission[permissionName][i].permission_value;
          }
        }
      }
    }
  }

  // Check for client  has permission
  hasClientPermissionByName(permissionName) {
    if (permissionName != null && permissionName != "") {
      if (this.clientPermission != null && Object.keys(this.clientPermission).length != 0) {
        for (let i = 0; i < Object.keys(this.clientPermission).length; i++) {
          console.log(Object.keys(this.clientPermission)[i] + " : " + this.clientPermission[permissionName]);
          if (Object.keys(this.clientPermission)[i] == permissionName) {
            return this.clientPermission[permissionName];
          }
        }
      }
    }
  }

  // set user data

  setUserdata() {
    this.getDataFromStorage("userData").then(value => {
      if (!value) {
        this.mUserName = "";
        this.mUserEmail = "";
        this.mUserData = null;
      } else {
        this.mUserName = value['user'].first_name + " " + value['user'].last_name;
        this.mUserEmail = value['user'].email;
        this.mUserData = value;
      }
    }).catch(err => {
      console.log(err);
    });
  }

}
