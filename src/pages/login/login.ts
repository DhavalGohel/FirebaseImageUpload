import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public data: any = {};
  public user: any = {
    email: "",
    password: ""
  };

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig) {
  }

  doLogin() {
    if (this.checkValidataion()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading("Loading...");

        this.userService.loginPost(this.user)
          .then(res => {
            this.appConfig.hideLoading();

            this.data = res;
            if (this.data.success) {
              this.appConfig.setDataInStorage('userData', this.data).then(success => {
                this.appConfig.setDataInStorage('isLogin', true);

                // AppConfig Set Data
                this.appConfig.setUserdata();
                this.appConfig.setUserPermissions();

                this.appConfig.showNativeToast("Login successfully.", "bottom", 3000);
                this.navCtrl.setRoot(DashboardPage);
              });
            } else {
              this.appConfig.setDataInStorage('userData', null);
              this.appConfig.setDataInStorage('isLogin', false);

              this.appConfig.showNativeToast((this.data.error ? this.data.error : "Network Error."), "bottom", 3000);
            }
          }).catch(err => {
            this.appConfig.showNativeToast("Network Error.", "bottom", 3000);
            this.appConfig.hideLoading();
          });
      } else {
        this.appConfig.showAlertMsg("Internet Connection", "No internet connection available.");
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
      this.appConfig.showNativeToast("Email Id is required", "bottom", 3000);
      return false;
    } else if (!this.appConfig.validateEmail(this.user.email)) {
      this.appConfig.showNativeToast("Please enter email id proper format", "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

  checkPasswordValidation() {
    if (this.user.password == "") {
      this.appConfig.showNativeToast("Password is required", "bottom", 3000);
      return false;
    } else if (this.user.password.length < 6) {
      this.appConfig.showNativeToast("Please enter minmum six character", "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

}
