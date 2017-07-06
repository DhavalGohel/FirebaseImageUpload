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
  public clientInfo: any = {};
  public clientLabels: any = [];
  public showNoTextMsg: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public dashboardService: DashboardService) {

    console.log(this.appConfig.companyPermisison);
    this.getSelectedCompany();
  }

  getSelectedCompany() {
    console.log(this.appConfig.clientAccountId);
    if (this.appConfig.hasConnection()) {
      let post_param = {
        "api_token": this.appConfig.mToken,
        "account_id": this.appConfig.clientAccountId
      };
      this.dashboardService.getSelectedCompany(post_param, this.appConfig.clientAccountId).then(data => {
        this.apiResult = data;
        if(this.apiResult.success){
            this.clientInfo = this.apiResult.info;
            if(this.clientInfo.labels != null){
              console.log(this.clientInfo.labels);
              console.log("laevbla");
              this.clientLabels = this.clientInfo.labels;
              console.log(this.clientLabels);
            }

        }else {
          this.showNoTextMsg = true;
        }
      }).catch(err => {
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      })
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }
}
