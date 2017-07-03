import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppCommonConfig } from '../../providers/AppCommonConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

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
    public userService: UserServiceProvider,
    public appCommonConfig: AppCommonConfig
  ) {

  }

  doLogin() {
    if (this.checkValidataion()) {
      if (this.appCommonConfig.hasConnection()) {
        this.appCommonConfig.showLoading("Loading...");

        this.userService.loginPost(this.user)
          .then(res => {
            this.appCommonConfig.hideLoading();

            this.data = res;
            if (this.data.success) {
              this.appCommonConfig.setDataInStorage('userData', this.data);
              this.appCommonConfig.setDataInStorage('isLogin', true);

              this.appCommonConfig.mUserData = this.data.user;
              this.appCommonConfig.mUserEmail = this.data.user.email;
              this.appCommonConfig.mUserName = this.data.user.first_name + " " + this.data.user.last_name;
              this.appCommonConfig.mUserNameChar = this.appCommonConfig.mUserName.substr(0, 1);

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
              this.appCommonConfig.mUserData = null;
              this.appCommonConfig.mUserEmail = "";
              this.appCommonConfig.mUserName = "";
              this.appCommonConfig.mUserNameChar = "";

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
  //  this.appCommonConfig.hideToast();
    if (this.user.email == "") {
      this.appCommonConfig.showToast("Email Id is required", "bottom", 3000, true, "Ok", true);
      return false;
    } else if (!this.appCommonConfig.validateEmail(this.user.email)) {
      this.appCommonConfig.showToast("Please enter email id proper format", "bottom", 3000, true, "Ok", true);
      return false;
    } else {
      return true;
    }
  }
  checkPasswordValidation() {
    this.appCommonConfig.hideToast();
    if (this.user.password == "") {
      this.appCommonConfig.showToast("Password is required", "bottom", 3000, true, "Ok", true);
      return false;
    } else if(this.user.password.length < 6) {
      this.appCommonConfig.showToast("Please enter minmum six character", "bottom", 3000, true, "Ok", true);
      return false;
    }else {
      return true;
    }
  }

}
