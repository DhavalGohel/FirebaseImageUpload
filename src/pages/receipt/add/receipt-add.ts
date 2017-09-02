import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ReceiptService } from '../../../providers/receipt-service/receipt-service';


@Component({
  selector: 'page-receipt-add',
  templateUrl: 'receipt-add.html'
})

export class ReceiptAddPage {
  public apiResult: any;
  public api_token = this.appConfig.mToken;

  public selectedTab: string = 'part_1';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public receiptService: ReceiptService) {

  }

  ionViewDidEnter() {
    this.onLoadGetCreateData();
  }

  ionViewWillLeave() {

  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.selectedTab = tabName;
    }, 500);
  }

  onLoadGetCreateData() {
    console.log("called...");
  }

  onClickCreateButton() {
    console.log("called click button...");
  }
}
