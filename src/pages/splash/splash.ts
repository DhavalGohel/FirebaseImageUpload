import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { LoginPage } from '../login/login';
import { DashboardCAPage } from '../dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../dashboard/Client/dashboard-client';
import { CompanyPage } from '../dashboard/Client/Company/company';
import { ConnectionPage } from '../connection/connection';

import { PushService } from '../../providers/push-service/push-service';

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


  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public pushService: PushService) {
  }

  ionViewDidEnter() {
    this.appConfig.menuSwipeEnable(false);
    this.setPageRedirect();
  }

  ionViewWillLeave() {
    if (this.isUserLoggedIn) {
      setTimeout(() => {
        this.pushService.setPushNotification();
      }, 2000);
    }
  }

  setPageRedirect() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.checkLogin().then(value => {
        if (value != null) {
          this.data = value;

          if (this.data.success) {
            this.isUserLoggedIn = true;
            this.appConfig.setUserdata();

            this.appConfig.setUserPermissions().then(success => {
              if (success) {
                if (this.data.user.roles[0].type != null) {
                  this.appConfig.mUserType = this.data.user.roles[0].type;

                  if (this.data.user.roles[0].type == "client") {
                    this.appConfig.checkIsCompanySelected().then(success => {
                      if (success) {
                        this.appConfig.getDataFromStorage("clientData").then(data => {
                          this.singleClientData = data;
                          this.setCompanyPermission();
                        });
                      } else {
                        this.userService.getCACompanyList().then(res => {
                          this.clientData = res;

                          if (this.clientData != null && this.clientData.success) {
                            if (Object.keys(this.clientData.accounts).length > 1) {
                              this.navCtrl.setRoot(CompanyPage);
                            } else {
                              this.singleClientData = this.clientData.accounts[0];

                              this.appConfig.setDataInStorage("clientData", this.singleClientData).then(success => {
                                this.userService.getClientPermissions(this.singleClientData.account_id).then(data => {
                                  this.clientDataPermission = data;

                                  if (this.clientDataPermission.success) {
                                    this.storeCompanyPermissions();
                                  } else {
                                    this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
                                  }
                                }).catch(err => {
                                  this.showNetworkAlert(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
                                });
                              });
                            }
                          } else {
                            this.showNetworkAlert(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
                          }
                        }).catch(err => {
                          this.showNetworkAlert(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
                        });
                      }
                    });
                  } else {
                    this.navCtrl.setRoot(DashboardCAPage);
                  }
                }
              }
            });
          } else {
            this.isUserLoggedIn = false;
            this.appConfig.clearUserData();
            this.navCtrl.setRoot(LoginPage);
          }
        } else {
          this.isUserLoggedIn = false;
          this.appConfig.clearUserData();
          this.navCtrl.setRoot(LoginPage);
        }
      });
    } else {
      this.navCtrl.push(ConnectionPage);
    }

  }

  storeCompanyPermissions() {
    this.appConfig.setDataInStorage('companyPermisison', this.clientDataPermission).then(success => {
      this.setCompanyPermission();
    });
  }

  setCompanyPermission() {
    this.appConfig.setCompanyPermissions().then(success => {
      this.appConfig.clientAccountId = this.singleClientData.account_id;
      if (success) {
        this.navCtrl.setRoot(DashboardClientPage);
      } else {
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      }
    });
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
