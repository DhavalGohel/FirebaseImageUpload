import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientGroupService } from '../../../providers/client-group/client-group-service';
import { ClientGroupListPage } from '../list/client-group-list';


@Component({
  selector: 'page-client-group-edit',
  templateUrl: 'client-group-edit.html'
})

export class ClientGroupEditPage {
  @ViewChild('txtGroupName') mEditTextGroupName;
  public mAlertBox: any;

  public mItemId: string = "";
  public api_token = this.appConfig.mUserData.user.api_token;
  public group_name: string = "";
  public apiResult: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientGroupService: ClientGroupService) {
    this.mItemId = this.navParams.data.item_id;

    if (this.mItemId != null && this.mItemId != "") {
      this.getClientGroupDetail();
    }
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
      buttons: ['Ok']
    });

    this.mAlertBox.present();
  }

  validateGroupName() {
    let isValid = true;

    if (this.group_name == null || (this.group_name != null && this.group_name.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  onClickEditClientGroup() {
    let isValid = true;

    if (!this.validateGroupName()) {
      this.showInValidateErrorMsg("Enter group name.");
      isValid = false;
    }

    if (isValid) {
      this.editClientGroup();
    }
  }

  getClientGroupDetail() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientGroupService.getClientGroupDetail(this.mItemId, this.api_token).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            if(this.apiResult.clientgroup != null && this.apiResult.clientgroup != ""){
              this.group_name = this.apiResult.clientgroup.name;
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

  editClientGroup() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "api_token": this.api_token,
        "name": this.group_name.trim(),
        "_method": "patch"
      };

      this.clientGroupService.actionClientGroup(this.mItemId, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.ClientGroupEditSuccess, "bottom", 3000);

            setTimeout(() => {
              this.navCtrl.setRoot(ClientGroupListPage);
            }, 500);
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

}
