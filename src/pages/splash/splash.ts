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

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public menuCtrl: MenuController) {
    this.menuCtrl.swipeEnable(false);
    this.setPageRedirect();
  }


  setPageRedirect() {
    console.log("here");
    this.appConfig.checkLogin().then(value => {
      if (value != null) {
        if (value['success']) {
          this.appConfig.setUserdata();
          this.appConfig.setUserPermissions().then(success => {
            if (success) {
              this.navCtrl.setRoot(DashboardCAPage);
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
