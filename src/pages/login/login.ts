import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppCommonConfig } from '../../providers/AppCommonConfig';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public user: any = {
    email: "",
    password: ""
  };

  public data: any = {};

  constructor(
    public navCtrl: NavController,
    public loginService: LoginServiceProvider,
    public appCommonConfig: AppCommonConfig
  ) {

  }

  doLogin() {
    if (this.appCommonConfig.hasConnection()) {
      this.appCommonConfig.showLoading("Loading...");

      this.loginService.loginPost(this.user)
        .then(res => {
          this.appCommonConfig.hideLoading();

          this.data = res;
          if (this.data.success) {
            this.appCommonConfig.setDataInStorage('userData', this.data);
            this.appCommonConfig.setDataInStorage('isLogin', true);
            this.appCommonConfig.mUserEmail = this.data.user.email;
            this.appCommonConfig.mUserName = this.data.user.first_name + " " + this.data.user.last_name;
            this.appCommonConfig.mUserData = this.data.user;
            if (this.data.user != null && this.data.user.roles[0]) {
              if (this.data.user.roles[0].permissions != null) {
                this.appCommonConfig.userPermission = this.data.user.roles[0].permissions;
              }

              if (this.data.user.roles[0].client_permissions != null) {
                this.appCommonConfig.clientPermission = this.data.user.roles[0].client_permissions;
              }
            }
            this.navCtrl.setRoot(DashboardPage);
          } else {
            this.appCommonConfig.mUserEmail = "";
            this.appCommonConfig.mUserName = "";
            this.appCommonConfig.mUserData = null;
            this.appCommonConfig.setDataInStorage('userData', null);
            this.appCommonConfig.setDataInStorage('isLogin', false);

            this.appCommonConfig.showToast((this.data.error ? this.data.error : "Network Error."), "bottom", 3000, true, "Ok", true);
          }
        }).catch(err => {
          this.appCommonConfig.showToast("Network Error.", "bottom", 3000, true, "Ok", true);
          this.appCommonConfig.hideLoading();
        }).catch();
    } else {
      this.appCommonConfig.showAlertMsg("Internet Connection", "No internet connection available.");
    }
  }

}
