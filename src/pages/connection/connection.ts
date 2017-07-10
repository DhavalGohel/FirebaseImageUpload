import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { AppConfig, AppMsgConfig} from '../../providers/AppConfig';

@Component({
  selector: 'page-connection',
  templateUrl: 'connection.html',
})
export class ConnectionPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private appConfig: AppConfig,
    private platform: Platform,
    private appMsgConfig: AppMsgConfig) {
    this.appConfig.menuSwipeEnableFalse();
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.platform.resume.subscribe(() => {
        console.log('[INFO] App resumed');
        this.checkInternet();
      });
      this.platform.registerBackButtonAction(() => {
        this.checkInternet();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectionPage');
  }

  openSetting() {
    if (this.appConfig.hasConnection()) {
      this.navCtrl.pop();
    } else {
      this.appConfig.openNativeSetting("settings");
    }
  }

  exitApp() {
    this.appConfig.exitApp();
  }

  registerBackButtonAction() {
    this.checkInternet();
  }

  checkInternet() {
    if (this.appConfig.hasConnection()) {
        this.navCtrl.pop();
    } else {
      this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, 'bottom', 3000);
    }
  }

}
