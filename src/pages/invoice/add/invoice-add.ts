import { Component } from '@angular/core';
import { NavController,NavParams} from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

import { InvoiceService } from '../../../providers/invoice/invoice-services';

@Component({
  selector: 'page-invoice-add',
  templateUrl: 'invoice-add.html',
})

export class InvoiceAddPage {
  public apiResult: any;
  public api_token = this.appConfig.mToken;

  public selectedTab: string = 'part_1';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public invoiceService: InvoiceService) {

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
