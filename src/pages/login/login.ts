import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { DashboardCAPage } from '../dashboard/CA/dashboard_ca';
import { ForgetPasswordPage } from '../forget-password/forget-password';

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
    public appConfig: AppConfig,
    public menuCtrl: MenuController) {
    this.menuCtrl.swipeEnable(false);
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
                this.appConfig.setUserPermissions().then(success => {
                  if (success) {
                    this.appConfig.showNativeToast("Login successfully.", "bottom", 3000);
                    this.navCtrl.setRoot(DashboardCAPage);
                  }
                });
              });
            } else {
              this.appConfig.setDataInStorage('userData', null);
              this.appConfig.setDataInStorage('isLogin', false);

              this.appConfig.showNativeToast((this.data.error ? this.data.error : this.appConfig.networkErrorMsg), "bottom", 3000);
            }
          }).catch(err => {
            this.appConfig.showNativeToast(this.appConfig.networkErrorMsg, "bottom", 3000);
            this.appConfig.hideLoading();
          });
      } else {
        this.appConfig.showAlertMsg("Internet Connection", this.appConfig.internetConnectionMsg);
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
      this.appConfig.showNativeToast("Enter email id", "bottom", 3000);
      return false;
    } else if (!this.appConfig.validateEmail(this.user.email)) {
      this.appConfig.showNativeToast("Please enter valid email id", "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

  checkPasswordValidation() {
    if (this.user.password == "") {
      this.appConfig.showNativeToast("Enter password", "bottom", 3000);
      return false;
    } else {
      return true;
    }
    // else if (this.user.password.length < 6) {
    //   this.appConfig.showNativeToast("Please enter password minimum six character", "bottom", 3000);
    //   return false;
    // }
  }

  gotoForgetPassword() {
    this.navCtrl.push(ForgetPasswordPage);
  }

}
