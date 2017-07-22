import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientService } from '../../../providers/client/client-service';

import { ClientAddPage } from '../add/client-add';
import { ClientEditPage } from '../edit/client-edit';
import { ClientDetailPage }from '../detail/client-detail';


@Component({
  selector: 'page-client',
  templateUrl: 'client.html'
})

export class ClientListPage {
  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public mInfiniteScroll: any;
  public mPopoverListOption: any;

  public page: number = 1;
  public total_items: number = 0;

  public apiResult: any;
  public mClientList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;

  public clientView: boolean = false;
  public clientCreate: boolean = false;
  public clientUpdate: boolean = false;
  public clientDelete: boolean = false;
  public clientGeneratePassword: boolean = false;
  public NoPermission: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientService: ClientService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
  }

  setPermissionData() {
    this.clientView = this.appConfig.hasUserPermissionByName('client', 'view');
    this.clientCreate = this.appConfig.hasUserPermissionByName('client', 'create');
    this.clientUpdate = this.appConfig.hasUserPermissionByName('client', 'update');
    this.clientDelete = this.appConfig.hasUserPermissionByName('client', 'delete');
    this.clientGeneratePassword = this.appConfig.hasUserPermissionByName('client', 'generate_password');

    if (!this.clientDelete && !this.clientUpdate && !this.clientGeneratePassword) {
      this.NoPermission = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    this.refreshData(false);
    this.getClientListData(true);

    this.eventsCtrl.subscribe('client:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('client:update', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ClientEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });

    this.eventsCtrl.subscribe('client:view', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ClientDetailPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('client:delete');
    this.eventsCtrl.unsubscribe('client:update');
    this.eventsCtrl.unsubscribe('client:view');
  }

  scrollPage() {
    if (this.mPopoverListOption != null) {
      this.mPopoverListOption.dismiss();
    }
  }

  onAddClick() {
    this.navCtrl.push(ClientAddPage);
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
    this.mPopoverListOption = this.popoverCtrl.create(ClientPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    this.mPopoverListOption.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mClientList != null && this.mClientList.length > 0) {
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
    this.getClientListData(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData(false);
    this.getClientListData(true);
  }

  refreshData(search) {
    if (!search) {
      this.searchText = "";
      this.showSearchBar = false;
    }


    this.page = 1;
    this.total_items = 0;
    this.mClientList = [];
    this.showNoTextMsg = false;

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  getClientListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.clientView) {
      if (this.appConfig.hasConnection()) {
        let token = this.appConfig.mUserData.user.api_token;

        if (showLoader) {
          this.appConfig.showLoading(this.appMsgConfig.Loading);
        }

        this.clientService.getClientList(token, this.searchText.trim(), this.page).then(data => {
          if (this.mInfiniteScroll != null) {
            this.mInfiniteScroll.complete();
          }

          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            if (this.apiResult.success) {
              this.setClientListData(this.apiResult);
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
    }
  }

  setClientListData(data) {
    // console.log(data);

    if (data.totalitem != null && data.totalitem != "") {
      this.total_items = data.totalitem;
    }

    if (data.clients != null && data.clients.length > 0) {
      for (let i = 0; i < data.clients.length; i++) {
        this.mClientList.push(data.clients[i]);
      }
    }

    this.manageNoData();
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    // console.log("Total Data : " + this.total_items);
    // console.log("Product Data : " + this.mClientList.length);

    if (this.mClientList.length < this.total_items) {
      this.page++;
      this.getClientListData(false);
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
      <button ion-item no-lines (click)="viewClient()">View</button>
      <button ion-item no-lines (click)="editClient()">Edit</button>
      <button ion-item no-lines (click)="confirmDeleteClient()">Delete</button>
      <button ion-item no-lines (click)="generatePassword()">Generate Password</button>
    </ion-list>
  `
})

export class ClientPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;

  public clientUpdate: boolean = false;
  public clientDelete: boolean = false;
  public clientTerminate: boolean = false;
  public clientGeneratePassword: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientService: ClientService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {
    this.clientUpdate = this.appConfig.hasUserPermissionByName('client', 'update');
    this.clientDelete = this.appConfig.hasUserPermissionByName('client', 'delete');
    this.clientGeneratePassword = this.appConfig.hasUserPermissionByName('client', 'generate_password');

    if (this.navParams != null && this.navParams.data != null) {
      this.itemData = this.navParams.data.item;
      this.token = this.appConfig.mUserData.user.api_token;
    }
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  editClient() {
    this.closePopover();
    this.eventsCtrl.publish('client:update', this.itemData);
  }

  viewClient() {
    this.closePopover();
    this.eventsCtrl.publish('client:view', this.itemData);
  }

  confirmDeleteClient() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Client,
      subTitle: this.appMsgConfig.ClientDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.deleteClient();
          }
        }]
    });

    this.mAlertDelete.present();
  }

  generatePassword() {
    this.closePopover();

    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        this.clientService.generatePassword(this.itemData.id, this.token).then(data => {
          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.EmployeesPasswordSuccess, "bottom", 3000);
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

  deleteClient() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        let post_param = {
          "api_token": this.token,
          "_method": "delete"
        };

        this.clientService.actionClient(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ClientDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('client:delete');
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
