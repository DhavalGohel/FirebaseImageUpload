import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ReceiptService } from '../../../providers/receipt-service/receipt-service';
import { ReceiptAddPage } from '../add/receipt-add';
import { ReceiptEditPage } from '../edit/receipt-edit';


@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html'
})

export class ReceiptListPage {
  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public mInfiniteScroll: any;
  public mPopoverListOption: any;

  public page: number = 1;
  public total_items: number = 0;

  public apiResult: any;
  public mReceiptList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;

  public receiptView: boolean = false;
  public receiptCreate: boolean = false;
  public receiptUpdate: boolean = false;
  public receiptDelete: boolean = false;
  public hasPermissions: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public receiptService: ReceiptService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
  }

  setPermissionData() {
    this.receiptView = this.appConfig.hasUserPermissionByName('receipts', 'view');
    this.receiptCreate = this.appConfig.hasUserPermissionByName('receipts', 'create');
    this.receiptUpdate = this.appConfig.hasUserPermissionByName('receipts', 'update');
    this.receiptDelete = this.appConfig.hasUserPermissionByName('receipts', 'delete');

    if (this.receiptDelete || this.receiptUpdate) {
      this.hasPermissions = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    this.refreshData(false);
    this.getReceiptListData(true);

    this.eventsCtrl.subscribe('receipt:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('receipt:update', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ReceiptEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('receipt:update');
    this.eventsCtrl.unsubscribe('receipt:delete');
  }

  scrollPage() {
    if (this.mPopoverListOption != null) {
      this.mPopoverListOption.dismiss();
    }
  }

  onAddClick() {
    this.navCtrl.push(ReceiptAddPage);
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
    this.mPopoverListOption = this.popoverCtrl.create(ReceiptPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    this.mPopoverListOption.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mReceiptList != null && this.mReceiptList.length > 0) {
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
    this.getReceiptListData(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData(false);
    this.getReceiptListData(true);
  }

  refreshData(search) {
    if (!search) {
      this.searchText = "";
      this.showSearchBar = false;
    }


    this.page = 1;
    this.total_items = 0;
    this.mReceiptList = [];
    this.showNoTextMsg = false;

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  getReceiptListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.receiptView) {
      if (this.appConfig.hasConnection()) {
        let token = this.appConfig.mUserData.user.api_token;

        if (showLoader) {
          this.appConfig.showLoading(this.appMsgConfig.Loading);
        }

        this.receiptService.getReceiptList(token, this.searchText.trim(), this.page).then(data => {
          if (this.mInfiniteScroll != null) {
            this.mInfiniteScroll.complete();
          }

          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            if (this.apiResult.success) {
              this.setReceiptListData(this.apiResult);
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

  setReceiptListData(data) {
    // console.log(data);

    if (data.totalitem != null && data.totalitem != "") {
      this.total_items = data.totalitem;
    }

    if (data.receipts != null && data.receipts.length > 0) {
      for (let i = 0; i < data.receipts.length; i++) {
        this.mReceiptList.push(data.receipts[i]);
      }
    }

    this.manageNoData();
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    // console.log("Total Data : " + this.total_items);
    // console.log("Product Data : " + this.mReceiptList.length);

    if (this.mReceiptList.length < this.total_items) {
      this.page++;
      this.getReceiptListData(false);
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
      <button ion-item no-lines (click)="onEditClick()" *ngIf=receiptUpdate>Edit</button>
      <button ion-item no-lines (click)="confirmDeleteClick()" *ngIf=receiptDelete>Delete</button>
    </ion-list>
  `
})

export class ReceiptPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;

  public receiptUpdate: boolean = false;
  public receiptDelete: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public receiptService: ReceiptService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {
    this.receiptUpdate = this.appConfig.hasUserPermissionByName('receipts', 'update');
    this.receiptDelete = this.appConfig.hasUserPermissionByName('receipts', 'delete');

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
    this.eventsCtrl.publish('receipt:update', this.itemData);
  }

  confirmDeleteClick() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Receipt,
      subTitle: this.appMsgConfig.ReceiptDeleteConfirm,
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

        this.receiptService.actionReceipt(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ReceiptDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('receipt:delete');
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
