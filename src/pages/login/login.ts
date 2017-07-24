import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { AppConfig ,AppMsgConfig} from '../../providers/AppConfig';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { DashboardCAPage } from '../dashboard/CA/dashboard_ca';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { DashboardClientPage } from '../dashboard/Client/dashboard-client';
import { CompanyPage } from '../dashboard/Client/Company/company';

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

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController) {
    this.menuCtrl.swipeEnable(false);
  }

  doLogin() {
    if (this.checkValidataion()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading("Loading...");

        this.userService.loginPost(this.user)
          .then(res => {
            this.data = res;
            if (this.data.success) {
              this.appConfig.setDataInStorage('userData', this.data).then(success => {
                this.appConfig.setDataInStorage('isLogin', true);

                // appConfig Data
                this.appConfig.setUserdata();
                this.appConfig.setUserPermissions().then(success => {
                  if (success) {
                    if(this.data.user.roles[0].type != null){
                      this.appConfig.mUserType = this.data.user.roles[0].type;
                    }
                    if (this.data.user.roles[0].type == "client") {

                      this.userService.getCACompanyList(this.data.user.api_token).then(res => {
                        this.appConfig.hideLoading();

                        this.clientData = res;
                        if (this.clientData != null && this.clientData.success) {
                          this.appConfig.setDataInStorage("isCompany",false);
                          if (Object.keys(this.clientData.accounts).length > 1) {
                            this.appConfig.showNativeToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000);
                            this.navCtrl.setRoot(CompanyPage);
                          } else {
                            this.singleClientData = this.clientData.accounts[0];
                            this.appConfig.setDataInStorage("clientData",this.singleClientData).then(success => {
                              this.userService.getClientPermissions(this.singleClientData.account_id).then(data => {
                                this.clientDataPermission = data;

                                if (this.clientDataPermission.success) {
                                  this.setCompanyPermission();
                                }
                              });
                            })
                          }   //  end if
                        }
                      }).catch(err => {
                        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
                        this.appConfig.hideLoading();
                      });
                    } else {
                      this.appConfig.hideLoading();
                      this.appConfig.showNativeToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000);
                      this.navCtrl.setRoot(DashboardCAPage);
                    }  //  end if
                  }
                });
              });
            } else {
              this.appConfig.setDataInStorage('userData', null);
              this.appConfig.setDataInStorage('isLogin', false);
              this.appConfig.hideLoading();
              this.appConfig.showNativeToast((this.data.error ? this.data.error : this.appMsgConfig.NetworkErrorMsg), "bottom", 3000);
            }
          }).catch(err => {
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
            this.appConfig.hideLoading();
          });
      } else {
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NetworkErrorMsg);
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
