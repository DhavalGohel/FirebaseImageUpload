import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {ClientService} from '../../../providers/client/client-service';

@Component({
  selector: 'page-client-extra',
  templateUrl: 'client-extra-field.html'
})


export class ClientExtraFieldPage
{
  public mAlertBox: any;

  public mItemId: string = "";
  public api_token = this.appConfig.mUserData.user.api_token;

  public contactView: boolean = false;
  public taskView: boolean = false;
  public mClientList: any = [];

  public apiResult: any;
  public status: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public clientService: ClientService,
    public appMsgConfig: AppMsgConfig
  ) {
    this.mItemId = this.navParams.data.item_id;

    if (this.mItemId != null && this.mItemId != "") {
      this.getClientDetail();
    }
    //this.setPermissionData();
  }

  getClientDetail() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientService.getClientDetail(this.mItemId, this.api_token).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            if (this.apiResult.client != null && this.apiResult.client != "") {
               this.setClientListData(this.apiResult);


            }
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }

        this.appConfig.hideLoading();
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
      this.navCtrl.pop();
    }
  }

  setClientListData(data) {
      console.log(data);

    if (data.client.client_data != null && data.client.client_data.length > 0) {
      for (let i = 0; i < data.client.client_data.length; i++) {
        this.mClientList.push(data.client.client_data[i]);
      }
    }
    console.log(this.mClientList.length);
  }

}
