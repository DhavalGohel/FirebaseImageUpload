import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ExpensesService } from '../../../providers/expenses-service/expenses-service';

import { ExpensesAddPage } from '../add/expenses-add';
import { ExpensesEditPage } from '../edit/expenses-edit';


@Component({
  selector: 'page-expenses-list',
  templateUrl: 'expenses-list.html'
})


export class ExpensesListPage {
  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public mInfiniteScroll: any;
  public mPopoverListOption: any;

  public page: number = 1;
  public total_items: number = 0;

  public apiResult: any;
  public mExpensesList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;

  public expenseView: boolean = false;
  public expenseCreate: boolean = false;
  public expenseUpdate: boolean = false;
  public expenseDelete: boolean = false;
  public hasPermissions: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
  }

  setPermissionData() {
    this.expenseView = this.appConfig.hasUserPermissionByName('expenses', 'view');
    this.expenseCreate = this.appConfig.hasUserPermissionByName('expenses', 'create');
    this.expenseUpdate = this.appConfig.hasUserPermissionByName('expenses', 'update');
    this.expenseDelete = this.appConfig.hasUserPermissionByName('expenses', 'delete');

    if (this.expenseUpdate || this.expenseDelete) {
      this.hasPermissions = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    this.refreshData(false);
    this.getExpensesListData(true);

    this.eventsCtrl.subscribe('expense:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('expense:update', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ExpensesEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('expense:update');
    this.eventsCtrl.unsubscribe('expense:delete');
  }

  scrollPage() {
    if (this.mPopoverListOption != null) {
      this.mPopoverListOption.dismiss();
    }
  }

  onAddClick() {
    this.navCtrl.push(ExpensesAddPage);
  }

  toggleSearchIcon() {
    this.showSearchBar = !this.showSearchBar;

    if (this.showSearchBar) {
      setTimeout(() => {
        this.mSearchBar.setFocus();
      }, 300);
    }
  }

  onSearchCancel() {
    this.showSearchBar = false;
  }

  onSearchBlurEvent() {
    if (this.searchText != null && this.searchText.trim().length <= 0) {
      this.onSearchCancel();
    }
  }

  clearSearchText() {
    this.searchText = "";
    this.showSearchBar = false;

    setTimeout(() => {
      this.getSearchData();
    }, 500);
  }

  presentPopover(myEvent, item) {
    this.mPopoverListOption = this.popoverCtrl.create(ExpensesPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    this.mPopoverListOption.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mExpensesList != null && this.mExpensesList.length > 0) {
      this.showNoTextMsg = false;
    } else {
      this.showNoTextMsg = true;
    }
  }

  searchData() {
    if (this.mSearchTimer != null) {
      clearTimeout(this.mSearchTimer);
    }

    this.mSearchTimer = setTimeout(() => {
      this.getSearchData();
    }, this.mSearchTimeDelay);
  }

  getSearchData() {
    this.refreshData(true);
    this.getExpensesListData(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData(false);
    this.getExpensesListData(true);
  }

  refreshData(search) {
    if (!search) {
      this.searchText = "";
      this.showSearchBar = false;
    }


    this.page = 1;
    this.total_items = 0;
    this.mExpensesList = [];
    this.showNoTextMsg = false;

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  getExpensesListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.expenseView) {
      if (this.appConfig.hasConnection()) {
        let token = this.appConfig.mUserData.user.api_token;

        if (showLoader) {
          this.appConfig.showLoading(this.appMsgConfig.Loading);
        }

        this.expensesService.getExpenseList(token, this.searchText.trim(), this.page).then(data => {
          if (this.mInfiniteScroll != null) {
            this.mInfiniteScroll.complete();
          }

          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            if (this.apiResult.success) {
              this.setExpensesListData(this.apiResult);
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
        this.manageNoData();
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    } else {
      this.manageNoData();
    }
  }

  setExpensesListData(data) {
    // console.log(data);

    if (data.totalitem != null && data.totalitem != "") {
      this.total_items = data.totalitem;
    }

    if (data.expenses != null && data.expenses.length > 0) {
      for (let i = 0; i < data.expenses.length; i++) {
        this.mExpensesList.push(data.expenses[i]);
      }
    }

    this.manageNoData();
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    // console.log("Total Data : " + this.total_items);
    // console.log("Product Data : " + this.mExpensesList.length);

    if (this.mExpensesList.length < this.total_items) {
      this.page++;
      this.getExpensesListData(false);
    } else {
      this.mInfiniteScroll.complete();
      this.mInfiniteScroll.enable(false);

      this.appConfig.showToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}

@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines (click)="onEditClick()" *ngIf=expenseUpdate>Edit</button>
      <button ion-item no-lines (click)="confirmDeleteClick()" *ngIf=expenseDelete>Delete</button>
    </ion-list>
  `
})

export class ExpensesPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;

  public expenseUpdate: boolean = false;
  public expenseDelete: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {
    this.expenseUpdate = this.appConfig.hasUserPermissionByName('expenses', 'update');
    this.expenseDelete = this.appConfig.hasUserPermissionByName('expenses', 'delete');

    if (this.navParams != null && this.navParams.data != null) {
      this.token = this.appConfig.mUserData.user.api_token;
      this.itemData = this.navParams.data.item;
      // console.log(this.itemData);
    }
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  onEditClick() {
    this.closePopover();
    this.eventsCtrl.publish('expense:update', this.itemData);
  }

  confirmDeleteClick() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Expenses,
      subTitle: this.appMsgConfig.ExpenseDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
        text: this.appMsgConfig.Yes,
        handler: data => {
          this.onDeleteItem();
        }
      }]
    });

    this.mAlertDelete.present();
  }

  onDeleteItem() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        let post_param = {
          "api_token": this.token,
          "_method": "delete"
        };

        this.expensesService.actionExpense(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ExpenseDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('expense:delete');
              }, 1000);
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
      }
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

}
