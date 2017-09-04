import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, Platform, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ReceiptService } from '../../../providers/receipt-service/receipt-service';


@Component({
  selector: 'page-receipt-add',
  templateUrl: 'receipt-add.html'
})

export class ReceiptAddPage {
  @ViewChild('navbar') navBar: Navbar;

  public apiResult: any;
  public api_token = this.appConfig.mToken;

  public selectedTab: string = 'part_1';

  public receiptData: any = {};
  public mPaymentDate: any = new Date().toISOString();
  public mClientDD: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public receiptService: ReceiptService,
    public platform: Platform,
    public eventsCtrl: Events) {

  }

  ionViewDidEnter() {
    this.platform.ready().then((readySource) => {
      this.platform.registerBackButtonAction(() => {
        this.onChangeTabFromBackButton();
      });

      this.navBar.backButtonClick = () => {
        this.onChangeTabFromBackButton();
      };
    });

    this.eventsCtrl.subscribe("search-select:refresh_value", (data) => {
      this.onSearchSelectChangeValue(data);
    });

    this.onLoadGetCreateData();
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
  }

  onChangeTabFromBackButton() {
    // console.log(this.selectedTab);

    if (this.selectedTab == "part_3") {
      this.onClickSetTab("part_2");
    } else if (this.selectedTab == "part_2") {
      this.onClickSetTab("part_1");
    } else if (this.selectedTab == "part_1"){
      this.navCtrl.pop();
    }
  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.selectedTab = tabName;
    }, 500);
  }

  onLoadGetCreateData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.receiptService.getCreateData(this.api_token).then(result => {
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
    console.log(data);

    if (data != null) {
      this.receiptData.reference_number = "";
      this.receiptData.payment_date = this.appConfig.transformDate(this.mPaymentDate);
      this.receiptData.client_id = "";

      if (data.receipt_prefix != null && data.receipt_prefix != "") {
        this.receiptData.receipt_prefix = data.receipt_prefix;
      }

      if (data.receipt_number != null && data.receipt_number != "") {
        this.receiptData.receipt_number = data.receipt_number;
      }

      if (data.clients != null && Object.keys(data.clients).length > 0) {
        this.mClientDD = this.appConfig.getFormattedArray(data.clients);
      }
    }
  }

  checkReceiptPrefix() {
    if (this.receiptData.receipt_prefix != null && this.receiptData.receipt_prefix != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter receipt prefix");
      return false;
    }
  }

  checkReceiptNumber() {
    if (this.receiptData.receipt_number != null && this.receiptData.receipt_number != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter receipt number");
      return false;
    }
  }

  checkReferenceNumber() {
    if (this.receiptData.reference_number != null && this.receiptData.reference_number != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter reference number");
      return false;
    }
  }

  checkClientId() {
    if (this.receiptData.client_id != null && this.receiptData.client_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Please select client");
      return false;
    }
  }

  hasValidateData() {
    let isValidate = true;

    if (!this.checkReceiptPrefix()) {
      isValidate = false;
    } else if(!this.checkReceiptNumber()) {
      isValidate = false;
    } else if(!this.checkReferenceNumber()) {
      isValidate = false;
    } else if (!this.checkClientId()) {
      isValidate = false;
    }

    return isValidate;
  }

  onClickCreateButton() {
    if (this.hasValidateData()) {
      this.receiptData.payment_date = this.appConfig.transformDate(this.mPaymentDate);

      console.log(this.receiptData);
    }
  }

  onClientChange() {
    if (this.receiptData.client_id != null && this.receiptData.client_id != "") {
      console.log("client id : " + this.receiptData.client_id);
    }
  }

  onSearchSelectChangeValue(data) {
    // console.log(data);

    if (data.element.id == "txtClient") {
      this.receiptData.client_id = data.data.key;

      this.onClientChange();
    }

  }

}
