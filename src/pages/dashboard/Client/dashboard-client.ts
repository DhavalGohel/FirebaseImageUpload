import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { DashboardService } from '../../../providers/dashboard/dashboard-service';

@Component({
  selector: 'page-dashboard-client',
  templateUrl: 'dashboard-client.html',
})
export class DashboardClientPage {
  apiResult: any;
  public mRefresher: any;

  public clientInfo: any = {};
  public showNoTextMsg: boolean = false;
  public clientLabels: any = {};
  public isShow: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public dashboardService: DashboardService) {

    //console.log(this.appConfig.companyPermisison);
    this.getSelectedCompany(true);
  }

  getSelectedCompany(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let post_param = {
        "api_token": this.appConfig.mToken,
        "account_id": this.appConfig.clientAccountId
      };

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }
      this.dashboardService.getSelectedCompany(post_param, this.appConfig.clientAccountId).then(data => {
        this.apiResult = data;
        if (this.apiResult.success) {
          if (this.apiResult.info != null) {
            this.clientInfo = this.apiResult.info;
            if (this.clientInfo.labels != null) {
              this.clientLabels = this.clientInfo.labels;
            }
            this.showNoTextMsg = false;
          } else {
            this.showNoTextMsg = true;
          }
        } else {
          this.showNoTextMsg = true;
        }
        this.appConfig.hideLoading();
      }).catch(err => {
        this.showNoTextMsg = false;
        this.appConfig.hideLoading();
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      })
    } else {
      this.showNoTextMsg = false;
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  showDetail() {
    this.isShow = !this.isShow;
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.clientInfo = {};
    this.showNoTextMsg = false;
    this.clientLabels = {};
    this.isShow = false;

    this.getSelectedCompany(true);
  }
}
