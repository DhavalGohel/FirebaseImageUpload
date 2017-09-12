
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {ClientDetailService} from '../../../providers/clientdetail-service/clientdetail-service';


@Component({
  selector: 'page-service-add',
  templateUrl: 'service-add.html'
})

export class ServiceAddPage
{
  public servicesData: any = [];
  public mUserServiceData: any = [];
  public mTempServiceData: any = [];
  public mTempCheckedArrayList: any = [];
  public sub_task_add: boolean =true;
  public mItemIndex: number;
  public mItemData: any;

  public mBirthdate: string = "";
  public amount: string = "";
  public apiResult: any;
  public searchService: string = "";
  public mSearchTimer: any;
  public api_token = this.appConfig.mToken;
  public clientID: string="";

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public eventCtrl: Events,
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public navParams: NavParams,
    public appMsgConfig: AppMsgConfig,
    public clientDetailService: ClientDetailService) {
      if (this.navParams.get('client_id') != null) {
        this.clientID = this.navParams.get('client_id');
      }
    // console.log(this.mItemData);
  }

  onSearchBlurEvent() {
    if (this.searchService != null && this.searchService.trim().length >= 0) {
      this.searchData();
    }
  }

  searchData() {
    if (this.mSearchTimer != null) {
      clearTimeout(this.mSearchTimer);
    }
    if (this.searchService != null && this.searchService.trim().length >= 0) {
      this.mSearchTimer = setTimeout(() => {
        this.mTempServiceData = this.mUserServiceData.filter((item) => {
          return (item.name.toLowerCase().indexOf(this.searchService.toLowerCase()) > -1);
        });

        let checkedArray = [];
        this.mUserServiceData.forEach(function(item) {
          if (item.status) {
            checkedArray.push(item);
          }
        });
        this.mTempCheckedArrayList = checkedArray;
      }, 300);

    } else {
      this.mTempServiceData = this.mUserServiceData;
    }
  }

  ionViewDidEnter() {
    this.onloadGetCreateData();
  }

  ionViewDidLeave() {

  }

  onloadGetCreateData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientDetailService.getUnusedServiceList(this.api_token,this.clientID).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setClientData(this.apiResult);
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

  setClientData(data) {
     this.servicesData = data.services;

     this.setServiceData();
  }

  setServiceData() {
    if (this.servicesData != null && this.servicesData.length > 0) {
      let serviceData = [];
      this.servicesData.forEach(function(item) {
        serviceData.push({ "account_service_master_id": item.id, "amount": item.amount, "status": false, "name": item.name });
      });
      this.mUserServiceData = serviceData;
    }
    this.mTempServiceData = this.mUserServiceData;
  }

  validateSubmitData(){
  //  if (this.isValidateData()) {
      console.log((this.sub_task_add == true) ? "yes" : "no");
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
        let post_params = this.setPostParamData();
        this.clientDetailService.addServiceData(post_params,this.clientID).then(result => {
          if (result != null) {
            this.appConfig.hideLoading();

            this.apiResult = result;

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ServicesAddSuccess, "bottom", 3000);
              setTimeout(() => {
                this.navCtrl.pop();
              }, 200)
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                // this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
                this.appConfig.displayApiErrors(this.apiResult);
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
  //  }
  }
    setPostParamData() {
      let mInvoiceService = [];

      for (let i = 0; i < this.mTempServiceData.length; i++) {
        mInvoiceService.push({
          account_service_master_id: this.mTempServiceData[i].account_service_master_id,
          status: this.mTempServiceData[i].status,
          amount: this.mTempServiceData[i].amount,
        });
      }


      let data = {
        api_token: this.api_token,
        sub_task_add:(this.sub_task_add == true) ? "yes" : "no",
      };
      data['service'] = mInvoiceService;
      return data;
    }


}
