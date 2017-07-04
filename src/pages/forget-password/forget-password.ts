import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  public email: string = "";
  public data: any = {};
  constructor(public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig
  ) { }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ForgetPasswordPage');
  }

  doSubmit() {
    if (this.checkEmailValidation()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading("Loading...");

        this.userService.forgetPasswordPost({ "email": this.email })
          .then(res => {
            this.appConfig.hideLoading();
            this.data = res;
            console.log(this.data);
            if(this.data.success){
                  this.appConfig.showNativeToast(this.data.message, "bottom", 3000);
                  this.navCtrl.pop();
            }else {
              this.appConfig.showNativeToast((this.data.error ? this.data.error: this.appConfig.networkErrorMsg ), "bottom", 3000);
            }
          }).catch(err => {
            console.log(err);
            this.appConfig.showNativeToast(this.appConfig.networkErrorMsg, "bottom", 3000);
            this.appConfig.hideLoading();
          });
      } else {
        this.appConfig.showAlertMsg("Internet Connection", this.appConfig.internetConnectionMsg);
      }
    }
  }

  checkEmailValidation() {
    if (this.email == "") {
      this.appConfig.showNativeToast("Enter email id", "bottom", 3000);
      return false;
    } else if (!this.appConfig.validateEmail(this.email)) {
      this.appConfig.showNativeToast("Please enter valid email id", "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

}
