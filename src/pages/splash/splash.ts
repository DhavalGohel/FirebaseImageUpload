import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { LoginPage } from '../login/login';
import { DashboardCAPage } from '../dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../dashboard/client/dashboard-client';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})

export class SplashPage {
  data: any = {};
  clientData: any = {};

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public menuCtrl: MenuController) {
    this.menuCtrl.swipeEnable(false);
    this.setPageRedirect();
  }


  setPageRedirect() {
    this.appConfig.checkLogin().then(value => {
      if (value != null) {
        this.data = value;
        if (this.data.success) {
          this.appConfig.setUserdata();
          this.appConfig.setUserPermissions().then(success => {
            if (success) {
              if (success) {
                if (this.data.user.roles[0].type == "client") {
                  if (this.appConfig.getDataFromStorage('isCompany')) {
                    //this.navCtrl.setRoot(DashboardClientPage);
                  } else {
                    this.userService.caCompanyListGet(this.data.user.api_token).then(res => {
                      this.clientData = res;
                      if (this.clientData != null && this.clientData.success) {
                        if (Object.keys(this.clientData.accounts).length > 1) {
                          console.log("multiple ca");
                          //this.navCtrl.setRoot(DashboardClientPage);
                        } else {
                          this.userService.getClientPermissions().then(success => {
                            this.navCtrl.setRoot(DashboardClientPage);
                          });
                        }
                      }
                    });
                  }
                } else {
                  this.appConfig.showNativeToast("Login successfully.", "bottom", 3000);
                  this.navCtrl.setRoot(DashboardCAPage);
                }
              }
            }
          });
        } else {
          this.appConfig.clearUserData();
          this.navCtrl.setRoot(LoginPage);
        }
      }
    });
  }


}
