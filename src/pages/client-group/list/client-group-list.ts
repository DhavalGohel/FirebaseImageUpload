import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientGroupService } from '../../../providers/client-group/client-group-service';


@Component({
  selector: 'page-client-group-list',
  templateUrl: 'client-group-list.html'
})

export class ClientGroupListPage {
  public mRefresher: any;

  public apiResult: any;
  public mClientGroupList: any = [];
  public showNoTextMsg: boolean = true;
  public searchText: string = "";

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientGroupService: ClientGroupService,
    public popoverCtrl: PopoverController) {
      this.getClientGroupListData(true);
  }

  onAddClick() {

  }

  presentPopover(myEvent, item) {
    let popover = this.popoverCtrl.create(ClientListPopoverPage, {
      item: item
    });

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

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getClientGroupListData(true);
  }

  refreshData() {
    this.searchText = "";

    this.mClientGroupList = [];
    this.showNoTextMsg = false;
  }

  getClientGroupListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

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
    <ion-list>
      <button ion-item no-lines (click)="editListItem()">Edit</button>
      <button ion-item no-lines (click)="deleteListItem()">Delete</button>
    </ion-list>
  `
})

export class ClientListPopoverPage {
  public itemData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientGroupService: ClientGroupService,
    public popoverCtrl: PopoverController) {
      if (this.navParams != null && this.navParams.data != null) {
        this.itemData = this.navParams.data.item;

        // console.log(this.navParams.data);
        console.log(this.itemData);
      }
    }

  editListItem() {
    this.closePopover();
  }

  deleteListItem() {
    this.closePopover();
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }
}
