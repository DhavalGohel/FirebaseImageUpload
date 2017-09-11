import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, Platform, Events, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ExpensesService } from '../../../providers/expenses-service/expenses-service';

@Component({
  selector: 'page-expenses-edit',
  templateUrl: 'expenses-edit.html'
})

export class ExpensesEditPage {
  @ViewChild('navbar') navBar: Navbar;

  public apiResult: any;
  public api_token = this.appConfig.mToken;
  public mItemId: string = "";

  public selectedTab: string = 'part_1';

  public expenseData: any = {};
  public mTodayDate: any = new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public expensesService: ExpensesService,
    public platform: Platform,
    public eventsCtrl: Events,
    public alertCtrl: AlertController) {
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
      // this.onSearchSelectChangeValue(data);
    });

    this.initExpenseData();

    if (this.navParams != null && this.navParams.data != null) {
      // console.log(this.navParams.data);

      if (this.navParams.data.item_id != null && this.navParams.data.item_id != "") {
        this.mItemId = this.navParams.data.item_id;
        this.onLoadGetEditData();
      }
    }
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
  }

  initExpenseData() {
    this.expenseData.name = "";
  }

  onChangeTabFromBackButton() {
    // console.log(this.selectedTab);

    if (this.selectedTab == "part_2") {
      this.onClickSetTab("part_1");
    } else if (this.selectedTab == "part_1") {
      this.navCtrl.pop();
    }
  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.selectedTab = tabName;
    }, 500);
  }

  onLoadGetEditData() {
    if (this.appConfig.hasConnection()) {
      console.log(this.mItemId);
    }
  }

}
