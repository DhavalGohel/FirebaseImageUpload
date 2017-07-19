import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientGroupService } from '../../../providers/client-group/client-group-service';
import { ClientGroupAddPage } from '../add/client-group-add';
import { ClientGroupEditPage } from '../edit/client-group-edit';


@Component({
  selector: 'page-client-group-list',
  templateUrl: 'client-group-list.html'
})

export class ClientGroupListPage {
  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public apiResult: any;
  public mClientGroupList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;
  public groupView: boolean = false;
  public groupUpdate: boolean = false;
  public groupCreate: boolean = false;
  public groupDelete: boolean = false;
  public NoPermission: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientGroupService: ClientGroupService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
  }

  setPermissionData() {
    this.groupView = this.appConfig.hasUserPermissionByName('client_group', 'view');
    this.groupCreate = this.appConfig.hasUserPermissionByName('client_group', 'create');
    this.groupUpdate = this.appConfig.hasUserPermissionByName('client_group', 'update');
    this.groupDelete = this.appConfig.hasUserPermissionByName('client_group', 'delete');

    if (!this.groupDelete && !this.groupUpdate) {
      this.NoPermission = true;
    }
  }

  ionViewDidEnter() {
    this.mClientGroupList = [];
    this.setPermissionData();
    this.getClientGroupListData(true);

    this.eventsCtrl.subscribe('client_group:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('client_group:update', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ClientGroupEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('client_group:delete');
    this.eventsCtrl.unsubscribe('client_group:update');
  }

  onAddClick() {
    this.navCtrl.push(ClientGroupAddPage);
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
    let popover = this.popoverCtrl.create(ClientListPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    popover.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mClientGroupList != null && this.mClientGroupList.length > 0) {
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

    this.getClientGroupListData(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData(false);
    this.getClientGroupListData(true);
  }

  refreshData(search) {
    if(!search){
      this.searchText = "";
      this.showSearchBar = false;
    }


    this.mClientGroupList = [];
    this.showNoTextMsg = false;
  }

  getClientGroupListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.groupView) {
      if (this.appConfig.hasConnection()) {
        let token = this.appConfig.mUserData.user.api_token;

        if (showLoader) {
          this.appConfig.showLoading(this.appMsgConfig.Loading);
        }

        this.clientGroupService.getClientGroupList(token, this.searchText.trim()).then(data => {
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
    } else {
      this.manageNoData();
    }
  }

  setClientListData(data) {
    // console.log(data);

    if (data.clientgroup != null && data.clientgroup.length > 0) {
      for (let i = 0; i < data.clientgroup.length; i++) {
        this.mClientGroupList.push(data.clientgroup[i]);
      }
    }

    this.manageNoData();
  }
}

@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines (click)="editClientGroup()" *ngIf="groupUpdate">Edit</button>
      <button ion-item no-lines (click)="confirmDeleteClientGroup()" *ngIf="groupDelete">Delete</button>
    </ion-list>
  `
})

export class ClientListPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;
  public groupUpdate: boolean = false;
  public groupDelete: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientGroupService: ClientGroupService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {

    this.groupUpdate = this.appConfig.hasUserPermissionByName('client_group', 'update');
    this.groupDelete = this.appConfig.hasUserPermissionByName('client_group', 'delete');

    if (this.navParams != null && this.navParams.data != null) {
      this.itemData = this.navParams.data.item;
      this.token = this.appConfig.mUserData.user.api_token;

      console.log(this.itemData);
    }
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  editClientGroup() {
    this.closePopover();

    this.eventsCtrl.publish('client_group:update', this.itemData);
  }

  confirmDeleteClientGroup() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.ClientGroup,
      subTitle: this.appMsgConfig.ClientGroupDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.deleteClientGroup();
          }
        }]
    });

    this.mAlertDelete.present();
  }

  deleteClientGroup() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        let post_param = {
          "api_token": this.token,
          "_method": "delete"
        };

        this.clientGroupService.actionClientGroup(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ClientGroupDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('client_group:delete');
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
}
