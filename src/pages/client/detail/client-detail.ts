import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {ClientService} from '../../../providers/client/client-service';

@Component({
  selector: 'page-client-detail',
  templateUrl: 'client-detail.html'
})


export class ClientDetailPage {
  public mAlertBox: any;

  public mItemId: string = "";
  public api_token = this.appConfig.mUserData.user.api_token;

  public apiResult: any;

  public client: any = {
    api_token: this.api_token,
    notify_via_sms: false
  };

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
              this.client.name = this.apiResult.client.name;
              this.client.address_1 = this.apiResult.client.address_1;
              this.client.address_2 = this.apiResult.client.address_2;
              this.client.client_type = this.apiResult.client.client_type;
              this.client.mobile = this.apiResult.client.mobile;
              this.client.email = this.apiResult.client.email;
              if (this.apiResult.client.notify_via_sms == "" || this.apiResult.client.notify_via_sms.toLowerCase() == "no") {
                this.client.notify_via_sms = false;
              }
              else {
                this.client.notify_via_sms = true;
              }

              if (this.apiResult.client.notify_via_email == "" || this.apiResult.client.notify_via_email.toLowerCase() == "no") {
                this.client.notify_via_email = false;
              }
              else {
                this.client.notify_via_email = true;
              }

              if (this.apiResult.client.create_login == "" || this.apiResult.client.create_login.toLowerCase() == "no") {
                this.client.create_login = false;
              }
              else {
                this.client.create_login = true;
              }
              this.client.client_group = this.apiResult.client.client_group;

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
  updateSMS() {
    console.log(this.client.notify_via_sms);

  }
  updateEmail() {
    console.log(this.client.notify_via_sms);

  }
  updateLogin() {
    console.log(this.client.notify_via_sms);

  }

}
