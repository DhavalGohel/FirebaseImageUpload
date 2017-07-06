import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { AppConfig,AppMsgConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { LoginPage } from '../login/login';
import { DashboardCAPage } from '../dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../dashboard/Client/dashboard-client';
import { CompanyPage } from '../dashboard/Client/Company/company';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})

export class SplashPage {
  data: any = {};
  clientData: any = {};
  public clientDataPermission: any = {};

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController) {
    this.menuCtrl.swipeEnable(false);
    this.setPageRedirect();
  }


  setPageRedirect() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.checkLogin().then(value => {
        if (value != null) {
          this.data = value;
          if (this.data.success) {
            this.appConfig.setUserdata();
            this.appConfig.setUserPermissions().then(success => {
              if (success) {
                if (this.data.user.roles[0].type == "client") {
                  this.appConfig.checkIsCompanySelected().then(success => {
                    if (success) {
                      this.setCompanyPermission();
                    } else {
                      this.userService.getCACompanyList().then(res => {
                        this.clientData = res;
                        if (this.clientData != null && this.clientData.success) {
                          if (Object.keys(this.clientData.accounts).length > 1) {
                            this.navCtrl.setRoot(CompanyPage);
                          } else {
                            this.userService.getClientPermissions().then(data => {
                              this.clientDataPermission = data;
                              if (this.clientDataPermission.success) {
                                this.storeCompanyPermissions();
                              } else {
                                this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
                              }
                            });
                          }
                        } else {
                          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
                        }
                      });
                    }
                  });
                } else {
                  this.navCtrl.setRoot(DashboardCAPage);
                }
              }
            });
          } else {
            this.appConfig.clearUserData();
            this.navCtrl.setRoot(LoginPage);
          }
        } else {
          this.appConfig.clearUserData();
          this.navCtrl.setRoot(LoginPage);
        }
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NetworkErrorMsg);
    }

  }

  storeCompanyPermissions(){
      this.appConfig.setDataInStorage('companyData', this.clientDataPermission).then(success => {
          this.setCompanyPermission();
      });
  }

  setCompanyPermission() {
      this.appConfig.setCompanyPermissions().then(success => {
        if (success) {
          this.navCtrl.setRoot(DashboardClientPage);
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      });
  }


}
