import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../../../providers/user-service/user-service';
import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { LoginPage } from '../../../login/login';
import { DashboardClientPage } from '../dashboard-client';
//import { ConnectionPage } from '../../../connection/connection';

@Component({
  selector: 'page-company',
  templateUrl: 'company.html',
})
export class CompanyPage {
  public mRefresher: any;

  companyList: any = [];
  companyData: any = {};
  clientDataPermission: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public userService: UserServiceProvider) {

  }

  ionViewDidEnter() {
    this.getCompanylistData(true);
  }

  getCompanylistData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }
    if (this.appConfig.hasConnection()) {

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.userService.getCACompanyList().then(data => {
        this.companyData = data;
        this.appConfig.hideLoading();
        if (this.companyData != null && this.companyData.success) {
          this.companyList = this.companyData.accounts;
        } else {
          this.appConfig.showNativeToast((this.companyData.error ? this.companyData.error : this.appMsgConfig.NetworkErrorMsg), "bottom", 3000);
        }
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  doLogout() {
    if (this.appConfig.hasConnection()) {
      //      let token = this.appConfig.mUserData.user.api_token;
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      this.userService.logout().then(success => {
        this.appConfig.hideLoading();
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

  doSelect(clientData, account_id) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      this.appConfig.setDataInStorage("clientData", clientData).then(success => {
        this.userService.getClientPermissions(account_id).then(data => {
          this.clientDataPermission = data;

          if (this.clientDataPermission.success) {
            this.setCompanyPermission(account_id);
          } else {
            this.appConfig.hideLoading();
            this.appConfig.clearStorageByKey("clientData");
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
          }
        }).catch(err => {
          this.appConfig.clearStorageByKey("clientData");
          this.appConfig.hideLoading();
        });
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setCompanyPermission(account_id) {
    this.appConfig.setDataInStorage('companyPermisison', this.clientDataPermission).then(success => {
      this.appConfig.clientAccountId = account_id;
      this.appConfig.setCompanyPermissions().then(success => {
        this.appConfig.hideLoading();
        if (success) {
          this.navCtrl.setRoot(DashboardClientPage);
          this.appConfig.setDataInStorage("isCompany", true);
        }
      });
    });
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.companyList = [];
    this.companyData = {};
    this.clientDataPermission = {};
    this.getCompanylistData(true);
  }

}
