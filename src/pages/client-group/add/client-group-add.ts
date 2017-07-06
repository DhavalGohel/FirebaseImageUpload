import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientGroupService } from '../../../providers/client-group/client-group-service';
import { ClientGroupListPage } from '../list/client-group-list';


@Component({
  selector: 'page-client-group-add',
  templateUrl: 'client-group-add.html'
})

export class ClientGroupAddPage {
  @ViewChild('edt_add') mEditTextAdd;

  public apiResult: any;
  public group_name: string = "";
  public mAlertBox: any;
  public api_token = this.appConfig.mUserData.user.api_token;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientGroupService: ClientGroupService) {

  }

  setFocus(object: any) {
    setTimeout(() => {
      object.setFocus();
    }, 500);
  }

  showInValidateErrorMsg(message) {
    this.mAlertBox = this.alertCtrl.create({
      title: "",
      subTitle: message,
      buttons:['Ok']
    });

    this.mAlertBox.present();
  }

  onClickAddClientGroup() {
    let isValid = true;

    if (!this.validateGroupName()) {
      this.showInValidateErrorMsg("Enter group name.");
      isValid = false;
    }

    if (isValid) {
      this.addClientGroup();
    }
  }

  validateGroupName() {
    let isValid = true;

    if (this.group_name == null || (this.group_name != null && this.group_name.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  addClientGroup() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "api_token": this.api_token,
        "name": this.group_name.trim()
      };

      this.clientGroupService.addClientGroup(post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.ClientGroupAddSuccess, "bottom", 3000);

            setTimeout(() => {
              this.navCtrl.setRoot(ClientGroupListPage);
            }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else if(this.apiResult.name != null && this.apiResult.name.length > 0) {
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

}
