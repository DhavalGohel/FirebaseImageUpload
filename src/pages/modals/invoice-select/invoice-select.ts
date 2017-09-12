import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';


@Component({
  templateUrl: 'invoice-select.html'
})

export class InvoiceSelectModel {
  public mItemIndex: number;
  public mItemData: any;
  public title: string = '';

  public isServices: boolean = false;

  public mCommonDD: any = [];

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public eventCtrl: Events,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig) {
    this.mItemIndex = this.params.get('index');
    this.mItemData = this.params.get('item');
    this.mCommonDD = this.params.get('valuedd');
    this.title = this.params.get('title');

    if (this.title.trim().toLowerCase() == 'service') {
      this.isServices = true;
    } else {
      this.isServices = false;
    }
  }

  dismiss() {
    if (this.viewCtrl != null) {
      // this.viewCtrl.dismiss(this.mItemIndex, this.mItemData);

      this.viewCtrl.dismiss(this.mItemIndex);
    }
  }

  onSubmit() {
    if (!this.checkSelectValidation()) {
    } else if (this.mItemData.amount == null || (this.mItemData.amount != null && this.mItemData.amount == "")) {
      this.appConfig.showAlertMsg("", "Please enter amount.");
    } else if (isNaN(+this.mItemData.amount) || parseInt(this.mItemData.amount) < 0) {
      this.appConfig.showAlertMsg("", "Please enter amount must be numeric.");
    } else {
      let newData = {
        itemIndex: this.mItemIndex,
        itemData: this.mItemData,
        itemType: this.isServices ? 'service' : 'expense',
      };

      setTimeout(() => {
        this.eventCtrl.publish("invoice-add:refresh_data", (newData));
        this.viewCtrl.dismiss(null);
      }, 500)

    }
  }

  checkSelectValidation() {
    let valid = true;

    if (this.isServices) {
      if (this.mItemData.service_id == null || (this.mItemData.service_id != null && this.mItemData.service_id == 0)) {
        this.appConfig.showAlertMsg("", "Please select client service.");
        valid = false;
      }
    } else {
      if (this.mItemData.expense_id == null || (this.mItemData.expense_id != null && this.mItemData.expense_id == 0)) {
        this.appConfig.showAlertMsg("", "Please select expense type.");
        valid = false;
      }
    }

    return valid;
  }

}
