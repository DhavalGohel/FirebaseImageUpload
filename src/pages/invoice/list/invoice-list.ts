import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, Events, ViewController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { InvoiceService } from '../../../providers/invoice-service/invoice-services';
import { InvoiceAddPage } from '../add/invoice-add';

@Component({
  selector: 'page-invoice-list',
  templateUrl: 'invoice-list.html'
})

export class InvoiceListPage {

  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public mInfiniteScroll: any;
  public mPopoverListOption: any;

  public apiResult: any;
  public page: number = 1;
  public total_items: number = 0;

  public mInvoicesList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;

  public invoiceView: boolean = false;
  public invoiceUpdate: boolean = false;
  public invoiceCreate: boolean = false;
  public invoiceDelete: boolean = false;
  public invoiceCancel: boolean = false;

  public NoPermission: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public invoiceService: InvoiceService,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
  }

  setPermissionData() {
    this.invoiceView = this.appConfig.hasUserPermissionByName('invoice', 'view');
    this.invoiceCreate = this.appConfig.hasUserPermissionByName('invoice', 'create');
    this.invoiceUpdate = this.appConfig.hasUserPermissionByName('invoice', 'update');
    this.invoiceDelete = this.appConfig.hasUserPermissionByName('invoice', 'delete');
    this.invoiceCancel = this.appConfig.hasUserPermissionByName('invoice', 'cancel_invoice');
    console.log(this.invoiceCancel);
    if (!this.invoiceDelete && !this.invoiceUpdate && !this.invoiceCancel) {
      this.NoPermission = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    this.refreshData(false);
    this.getEmployeeList(true);

    this.eventsCtrl.subscribe('invoice:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('invoice:cancel', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('invoice:uncancel', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('invoice:update', (itemData) => {
      if (itemData != null) {
        //  console.log(itemData);
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(InvoiceAddPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('invoice:delete');
    this.eventsCtrl.unsubscribe('invoice:cancel');
    this.eventsCtrl.unsubscribe('invoice:update');
    this.eventsCtrl.unsubscribe('invoice:uncancel');

  }

  scrollPage() {
    if (this.mPopoverListOption != null) {
      this.mPopoverListOption.dismiss();
    }
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
    this.mPopoverListOption = this.popoverCtrl.create(InvoiceListPopoverPage, {
      item: item
    }, {
        cssClass: 'custom-popover',
        enableBackdropDismiss: true
      });

    this.mPopoverListOption.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mInvoicesList != null && this.mInvoicesList.length > 0) {
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
    this.getEmployeeList(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData(false);
    this.getEmployeeList(true);
  }

  refreshData(search) {
    if (!search) {
      this.searchText = "";
      this.showSearchBar = false;
    }


    this.page = 1;
    this.total_items = 0;
    this.mInvoicesList = [];
    this.showNoTextMsg = false;

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    if (this.mInvoicesList.length < this.total_items) {
      this.page++;
      this.getEmployeeList(false);
    } else {
      this.mInfiniteScroll.complete();
      this.mInfiniteScroll.enable(false);

      this.appConfig.showToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000, true, "Ok", true);
    }
  }

  getEmployeeList(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.invoiceService.getInvoiceListData(token, this.page, this.searchText.trim()).then(data => {
        if (this.mInfiniteScroll != null) {
          this.mInfiniteScroll.complete();
        }

        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          if (this.apiResult.success) {
            this.setInvoiceListData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }

            this.manageNoData();
          }
        } else {
          this.appConfig.hideLoading();
          this.manageNoData();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.manageNoData();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.manageNoData();
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setInvoiceListData(data) {
    // console.log(data);

    if (this.apiResult.total != null && this.apiResult.total != "") {
      this.total_items = this.apiResult.total;
    }

    if (data.invoices != null && data.invoices.length > 0) {
      for (let i = 0; i < data.invoices.length; i++) {
        this.mInvoicesList.push(data.invoices[i]);
      }
    }

    this.manageNoData();
  }

  onAddClick() {
    this.navCtrl.push(InvoiceAddPage);
  }
}

@Component({
  template: `
      <ion-list no-margin>
        <button ion-item no-lines (click)="editInvoice()" *ngIf="invoiceUpdate && itemData.is_cancel.toLowerCase() == 'no' ">Edit</button>
        <button ion-item no-lines (click)="confirmDeleteInvoice()" *ngIf="invoiceDelete && itemData.is_cancel.toLowerCase() == 'no' ">Delete</button>
        <button ion-item no-lines (click)="cancelInvoice()" *ngIf="invoiceCancel &&  itemData.is_cancel.toLowerCase() == 'no' ">Cancel Invoice</button>
        <button ion-item no-lines (click)="uncancelInvoice()" *ngIf="itemData.is_cancel.toLowerCase() == 'yes' ">Uncancel Invoice</button>
      </ion-list>
    `
})

export class InvoiceListPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;

  public mInvoicesList: any = [];
  public invoice_id: string;

  public invoiceUpdate: boolean = false;
  public invoiceDelete: boolean = false;
  public invoiceCancel: boolean = false;
  public employeeuncancelInvoice: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public invoiceService: InvoiceService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {

    this.invoiceUpdate = this.appConfig.hasUserPermissionByName('invoice', 'update');
    this.invoiceDelete = this.appConfig.hasUserPermissionByName('invoice', 'delete');
    this.invoiceCancel = this.appConfig.hasUserPermissionByName('invoice', 'cancel_invoice');

    if (this.navParams != null && this.navParams.data != null) {
      this.itemData = this.navParams.get('item');
      this.token = this.appConfig.mUserData.user.api_token;
    }
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  editInvoice() {
    this.closePopover();

    this.eventsCtrl.publish('invoice:update', this.itemData);
  }

  confirmDeleteInvoice() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Invoice,
      subTitle: this.appMsgConfig.InvoiceDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.deleteEmployee();
          }
        }]
    });

    this.mAlertDelete.present();
  }

  deleteEmployee() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        let post_param = {
          "api_token": this.token,
          "_method": "delete"
        };

        this.invoiceService.deleteInvoice(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.InvoiceDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('invoice:delete');
              }, 1000);
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
              }
            }
          } else {
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
          }

          this.appConfig.hideLoading();
        }, error => {
          this.appConfig.hideLoading();
          this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
        });
      }
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  cancelInvoice() {
    this.closePopover();
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      if (this.itemData != null) {
        this.invoiceService.cancelInvoice(this.token, this.itemData.id).then(data => {
          if (data != null) {
            this.apiResult = data;
            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.invoiceCancelSuccess, "bottom", 3000);
              setTimeout(() => {
                this.eventsCtrl.publish('invoice:cancel');
              }, 1000);
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
              }
            }

          }
          this.appConfig.hideLoading();
        }, error => {
          this.appConfig.hideLoading();
          this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
        })
      }
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  uncancelInvoice() {
    this.closePopover();
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      if (this.itemData != null) {
        this.invoiceService.uncancelInvoice(this.token, this.itemData.id).then(data => {
          if (data != null) {
            this.apiResult = data;
            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.invoiceUnCancelSuccess, "bottom", 3000);
              setTimeout(() => {
                this.eventsCtrl.publish('invoice:uncancel');
              }, 1000);
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
              }
            }

          }
          this.appConfig.hideLoading();
        }, error => {
          this.appConfig.hideLoading();
          this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
        })
      }
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

}
