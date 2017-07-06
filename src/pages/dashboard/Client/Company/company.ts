import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../../../providers/user-service/user-service';
import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { LoginPage } from '../../../login/login';
import { DashboardClientPage } from '../dashboard-client';

@Component({
  selector: 'page-company',
  templateUrl: 'company.html',
})
export class CompanyPage {
  companyList: any = [];
  companyData: any = {};
  clientDataPermission: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public userService: UserServiceProvider) {
    this.getCompanylistData();
  }

  getCompanylistData() {
    if (this.appConfig.hasConnection()) {
      this.userService.getCACompanyList().then(data => {
        this.companyData = data;
        if (this.companyData != null && this.companyData.success) {
          this.companyList = this.companyData.accounts;
        } else {
          this.appConfig.showNativeToast((this.companyData.error != "" ? this.companyData.error : this.appMsgConfig.NetworkErrorMsg), "bottom", 3000);
        }
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  doLogout() {
    if (this.appConfig.hasConnection()) {
      //      let token = this.appConfig.mUserData.user.api_token;
      this.userService.logout().then(success => {
        if (success) {
          this.appConfig.clearUserData();
          this.appConfig.showNativeToast(this.appMsgConfig.LogoutSuccessMsg, "bottom", 3000);
          this.navCtrl.setRoot(LoginPage);
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  doSelect(account_id) {
    console.log(account_id);
    if (this.appConfig.hasConnection()) {
      this.userService.getClientPermissions(account_id).then(data => {
        this.clientDataPermission = data;

        if (this.clientDataPermission.success) {
          this.setCompanyPermission();
        }
      });
    }else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setCompanyPermission() {
    this.appConfig.setDataInStorage('companyData', this.clientDataPermission).then(success => {
      this.appConfig.setCompanyPermissions().then(success => {
        if (success) {
          this.navCtrl.setRoot(DashboardClientPage);
          this.appConfig.setDataInStorage("isCompany",true);
        }
      });
    });
  }

}
