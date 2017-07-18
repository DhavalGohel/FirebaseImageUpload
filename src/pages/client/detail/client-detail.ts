import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {ClientService} from '../../../providers/client/client-service';
import {ClientListPage} from '../../client/list/client';
@Component({
  selector: 'page-client-detail',
  templateUrl: 'client-detail.html'
})


export class ClientDetailPage {
  public mAlertBox: any;

  public mItemId: string = "";
  public api_token = this.appConfig.mUserData.user.api_token;
  public contactView: boolean = false;
  public taskView: boolean = false;
  public mClientList: any = [];
  public apiResult: any;
  public status: string;

  public client: any = {

    name: "",
    address_1: "",
    address_2: "",
    client_type: "",
    mobile: "",
    email: "",
    api_token: this.api_token,
    notify_via_sms: false,
    notify_via_email: false,
    create_login: false,
    client_group: ""
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
    this.setPermissionData();
  }

  setPermissionData() {
    this.contactView = this.appConfig.hasUserPermissionByName('client_contact', 'view');
    this.taskView = this.appConfig.hasUserPermissionByName('tasks', 'view');

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
              this.setClientListData(this.apiResult);
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
    if(this.client.notify_via_sms == false)
    {
      this.status="no";
    }
    else{
        this.status="yes";
    }
    this.updateSMSEmailStatus("notify_via_sms");

  }
  updateEmail() {
    console.log(this.client.notify_via_email);
    if(this.client.notify_via_email == false)
    {
      this.status="no";
    }
    else{
        this.status="yes";
    }
    this.updateSMSEmailStatus("notify_via_email");

  }
  updateLogin() {
    console.log(this.client.create_login);
    if(this.client.create_login == false)
    {
      this.status="no";
    }
    else{
        this.status="yes";
    }
    this.updateLoginStatus();
  }


  updateLoginStatus() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "api_token": this.api_token,
        "column": "create_login",
        "value": this.status
      };

      this.clientService.changeLoginNotfication(this.mItemId, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.ClientLoginStatus, "bottom", 3000);
            //this.getClientDetail();
            // setTimeout(() => {
            //   this.navCtrl.setRoot(ClientListPage);
            // }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else if (this.apiResult.name != null && this.apiResult.name.length > 0) {
              this.appConfig.showAlertMsg("", this.apiResult.name[0]);
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
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  updateSMSEmailStatus(cloumn?: string) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "api_token": this.api_token,
        "column": cloumn,
        "value": this.status
      };

      this.clientService.changeSMSandEmailNotfication(this.mItemId, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            if (cloumn == "notify_via_sms") {
              this.appConfig.showNativeToast(this.appMsgConfig.ClientSMSStatus, "bottom", 3000);
            }
            else {
              this.appConfig.showNativeToast(this.appMsgConfig.ClientEmailStatus, "bottom", 3000);
            }
          //  this.getClientDetail();
            // setTimeout(() => {
            //   this.navCtrl.setRoot(ClientListPage);
            // }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else if (this.apiResult.name != null && this.apiResult.name.length > 0) {
              this.appConfig.showAlertMsg("", this.apiResult.name[0]);
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
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
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
