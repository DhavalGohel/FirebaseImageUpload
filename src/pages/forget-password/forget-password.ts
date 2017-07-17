import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

import { AppConfig ,AppMsgConfig} from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import {LoginPage} from '../../pages/login/login';

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  public email: string = "";
  public data: any = {};
  constructor(public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig
  ) { }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ForgetPasswordPage');
  }

  swipeEvent($event){
    switch ($event.direction){
        case 4:
        this.navCtrl.pop();
        break;
        default :
        console.log("default");
    }
  }
  backToLogin() {
    this.navCtrl.push(LoginPage);
  }
  doSubmit() {
    if (this.checkEmailValidation()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading("Loading...");

        this.userService.forgetPasswordPost({ "email": this.email })
          .then(res => {
            this.appConfig.hideLoading();
            this.data = res;

            if (this.data.success) {
              this.appConfig.showNativeToast(this.data.message, "bottom", 3000);
              this.navCtrl.pop();
            } else {
              this.appConfig.showNativeToast((this.data.error ? this.data.error : this.appMsgConfig.NetworkErrorMsg), "bottom", 3000);
            }
          }).catch(err => {
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
            this.appConfig.hideLoading();
          });
      } else {
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    }
  }

  checkEmailValidation() {
    if (this.email == "") {
      this.appConfig.showNativeToast(this.appMsgConfig.EmailRequiredMsg, "bottom", 3000);
      return false;
    } else if (!this.appConfig.validateEmail(this.email)) {
      this.appConfig.showNativeToast(this.appMsgConfig.EmailValidMsg, "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

}
