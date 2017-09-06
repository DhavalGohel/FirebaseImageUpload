import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PushService } from '../../providers/push-service/push-service';

import { DashboardCAPage } from '../dashboard/CA/dashboard_ca';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { DashboardClientPage } from '../dashboard/Client/dashboard-client';
import { CompanyPage } from '../dashboard/Client/Company/company';
import { ConnectionPage } from '../connection/connection';

declare var cordova: any;


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public data: any = {};
  public clientData: any = {};
  public singleClientData: any = {};
  public clientDataPermission: any = {};

  public user: any = {
    email: "",
    password: ""
  };

  public isUserLoggedIn: boolean = false;
  public appUpdateAlert: any;


  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public pushService: PushService,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController) {
  }

  ionViewDidEnter() {
    this.appConfig.menuSwipeEnable(false);

    this.checkAppVersionUpdate();
  }

  ionViewWillLeave() {
    if (this.isUserLoggedIn) {
      setTimeout(() => {
        // this.pushService.setPushNotification();
      }, 2000);
    }
  }

  checkAppVersionUpdate() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.getAppVersion().then(version => {
        if (version != null) {
          let post_params = {
            "version": version
          };

          this.pushService.checkAppVersionAPI(post_params).then(result => {
            let apiRes: any = result;

            if (apiRes != null && apiRes.success == true) {
              this.showUpdateAlert();
            }
          }, error => {
            // To-do
          });
        }
      });
    } else {
      this.navCtrl.push(ConnectionPage);
    }
  }

  showUpdateAlert() {
    this.appUpdateAlert = this.alertCtrl.create({
      title: 'Onzup',
      subTitle: 'Onzup app update is available now. Would you like to update Onzup?',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'UPDATE NOW',
        handler: () => {
          let storeURL = "";

          if (this.appConfig.isRunOnAndroidDevice()) {
            storeURL = "https://play.google.com/store/apps/details?id=pkg.android.srtpl.onzupcustomer";
          } else if (this.appConfig.isRunOnIos()) {
            storeURL = "https://itunes.apple.com/us/app/onzup/id1262749506";
          }

          cordova.InAppBrowser.open(storeURL, "_system");
        }
      }]
    });

    this.appUpdateAlert.present();
  }

  doLogin() {
    if (this.checkValidataion()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);

        this.userService.loginPost(this.user)
          .then(res => {
            this.data = res;

            if (this.data.success) {
              this.appConfig.setDataInStorage('userData', this.data).then(success => {
                this.isUserLoggedIn = true;
                this.appConfig.setDataInStorage('isLogin', true);

                // appConfig Data
                this.appConfig.setUserdata();

                this.appConfig.setUserPermissions().then(success => {
                  if (success) {
                    if (this.data.user.roles[0].type != null) {
                      this.appConfig.mUserType = this.data.user.roles[0].type;
                    }

                    if (this.data.user.roles[0].type == "client") {
                      this.userService.getCACompanyList(this.data.user.api_token).then(res => {
                        this.appConfig.hideLoading();

                        this.clientData = res;
                        if (this.clientData != null && this.clientData.success) {
                          this.appConfig.setDataInStorage("isCompany", false);

                          if (Object.keys(this.clientData.accounts).length > 1) {
                            this.appConfig.showNativeToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000);
                            this.navCtrl.setRoot(CompanyPage);
                          } else {
                            this.singleClientData = this.clientData.accounts[0];
                            this.appConfig.setDataInStorage("clientData", this.singleClientData).then(success => {
                              this.userService.getClientPermissions(this.singleClientData.account_id).then(data => {
                                this.clientDataPermission = data;

                                if (this.clientDataPermission.success) {
                                  this.setCompanyPermission();
                                }
                              });
                            })
                          }
                        }
                      }).catch(err => {
                        this.appConfig.hideLoading();
                        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
                      });
                    } else {
                      this.appConfig.hideLoading();
                      this.appConfig.showNativeToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000);
                      this.navCtrl.setRoot(DashboardCAPage);
                    }
                  }
                });
              });
            } else {
              this.appConfig.hideLoading();
              this.isUserLoggedIn = false;
              this.appConfig.setDataInStorage('userData', null);
              this.appConfig.setDataInStorage('isLogin', false);
              this.appConfig.showNativeToast((this.data.error ? this.data.error : this.appMsgConfig.NetworkErrorMsg), "bottom", 3000);
            }
          }).catch(err => {
            this.appConfig.hideLoading();
            this.isUserLoggedIn = false;
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
          });
      } else {
        this.isUserLoggedIn = false;
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    }
  }

  checkValidataion() {
    if (!this.checkEmailValidation()) {
      return false;
    } else if (!this.checkPasswordValidation()) {
      return false;
    } else {
      return true;
    }
  }

  checkEmailValidation() {
    if (this.user.email == "") {
      this.appConfig.showNativeToast(this.appMsgConfig.EmailRequiredMsg, "bottom", 3000);
      return false;
    } else if (!this.appConfig.validateEmail(this.user.email)) {
      this.appConfig.showNativeToast(this.appMsgConfig.EmailValidMsg, "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

  checkPasswordValidation() {
    if (this.user.password == "") {
      this.appConfig.showNativeToast(this.appMsgConfig.PassowordRequiredMsg, "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

  gotoForgetPassword() {
    this.navCtrl.push(ForgetPasswordPage);
  }

  setCompanyPermission() {
    this.appConfig.setDataInStorage('companyPermisison', this.clientDataPermission).then(success => {
      this.appConfig.clientAccountId = this.singleClientData.account_id;

      this.appConfig.setCompanyPermissions().then(success => {
        if (success) {
          this.navCtrl.setRoot(DashboardClientPage);
          this.appConfig.showNativeToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000);
        }
      });
    });
  }

}
