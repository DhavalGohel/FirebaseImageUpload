import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {ClientDetailService} from '../../../providers/clientdetail-service/clientdetail-service';

@Component({
  templateUrl: 'service-edit.html'
})

export class ServiceEditPage{
  public mItemIndex: number;
  public mItemData: any;

  public mBirthdate: string = "";
  public amount: string = "";
  public apiResult: any;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public eventCtrl: Events,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientDetailService: ClientDetailService) {
    this.mItemData = this.params.get('item');
    this.mBirthdate= this.mItemData.start_date;
    this.mBirthdate = this.appConfig.transformDate(this.mBirthdate);
    console.log(this.mBirthdate);
    this.amount=this.mItemData.amount;
    this.mBirthdate = this.appConfig.stringToDateToISO(this.mBirthdate);
    // console.log(this.mItemData);
  }

  dismiss() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  validateSubmitData() {

    if (this.mBirthdate == null || this.mBirthdate == "") {
      this.appConfig.showAlertMsg("", this.appMsgConfig.ServicesStartDateAdd);
    } else {
      let post_params = {
        "amount":this.amount,
        "start_date": this.appConfig.transformDate(this.mBirthdate),
        "api_token": this.appConfig.mUserData.user.api_token

      };

      this.actionTaskSpentTime(post_params);
    }
  }

  actionTaskSpentTime (post_params) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      //let token = this.appConfig.mUserData.user.api_token;

      this.clientDetailService.editService(this.mItemData.id, post_params).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.ServicesEditSuccess, "bottom", 3000);

            setTimeout(() => {
              this.eventCtrl.publish('service:update');
              this.dismiss();
            }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

}
