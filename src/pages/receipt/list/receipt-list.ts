import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html'
})

export class ReceiptListPage {

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig) {
  }

  ionViewDidEnter() {
  }

}
