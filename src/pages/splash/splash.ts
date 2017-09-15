import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { DashboardPage } from '../dashboard/dashboard';
import { ConnectionPage } from '../connection/connection';

// declare var cordova: any;


@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})

export class SplashPage {
  public data: any = {};
  public clientData: any = {};
  public singleClientData: any = {};
  public clientDataPermission: any = {};
  public isUserLoggedIn: boolean = false;
  public appUpdateAlert: any;
  public mPlatformResumeObject: any;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public platform: Platform) {
    this.platform.ready().then((readySource) => {
      this.setPageRedirect();
    });
  }

  ionViewDidEnter() {
    this.appConfig.menuSwipeEnable(false);
  }

  ionViewWillLeave() {
  }

  // checkAppVersionUpdate() {
  //   if (this.appConfig.hasConnection()) {
  //     if (this.appConfig.isRunOnMobileDevice()) {
  //       this.appConfig.getAppVersion().then(version => {
  //         if (version != null) {
  //           let post_params = {
  //             "version": version
  //           };
  //
  //           this.pushService.checkAppVersionAPI(post_params).then(result => {
  //             let apiRes: any = result;
  //
  //             if (apiRes != null && apiRes.success == true) {
  //               this.showUpdateAlert();
  //             } else {
  //               this.setPageRedirect();
  //             }
  //           }, error => {
  //             this.setPageRedirect();
  //           });
  //         }
  //       });
  //     } else {
  //       this.setPageRedirect();
  //     }
  //   } else {
  //     this.navCtrl.push(ConnectionPage);
  //   }
  // }

  // showUpdateAlert() {
  //   this.appUpdateAlert = this.alertCtrl.create({
  //     title: 'Onzup',
  //     subTitle: 'Onzup update is available now, Please update it.',
  //     enableBackdropDismiss: false,
  //     buttons: [{
  //       text: 'UPDATE NOW',
  //       handler: () => {
  //         let storeURL = "";
  //
  //         if (this.appConfig.isRunOnAndroidDevice()) {
  //           storeURL = "https://play.google.com/store/apps/details?id=pkg.android.srtpl.onzupcustomer";
  //         } else if (this.appConfig.isRunOnIos()) {
  //           storeURL = "https://itunes.apple.com/us/app/onzup/id1262749506";
  //         }
  //
  //         cordova.InAppBrowser.open(storeURL, "_system");
  //       }
  //     }]
  //   });
  //
  //   this.appUpdateAlert.present();
  // }

  setPageRedirect() {
    if (this.appConfig.hasConnection()) {
          this.navCtrl.setRoot(DashboardPage);
    } else {
      this.navCtrl.push(ConnectionPage);
    }

  }

  showNetworkAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: "Exit",
        handler: data => {
          this.appConfig.exitApp();
        }
      }, {
          text: "Retry",
          handler: data => {
            setTimeout(time => {
              this.setPageRedirect();
            }, 1000);
          }
        }]
    });

    alert.present();
  }

}
