import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientContactService } from '../../../providers/contact/contact-service';
import { ClientContactAddPage } from '../add/contact-add';
import { ClientContactEditPage } from '../edit/contact-edit';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ClientContactPage {
  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public mInfiniteScroll: any;
  public mPopoverListOption: any;

  public apiResult: any;
  public page: number = 1;
  public total_items: number = 0;

  public mClientContactList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;
  public showSearchIcon : boolean = true;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;
  public contactView: boolean = false;
  public contactUpdate: boolean = false;
  public contactCreate: boolean = false;
  public contactDelete: boolean = false;
  public NoPermission: boolean = false;

  public mClientId: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientContactService: ClientContactService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
      if(this.navParams.get('client_id') != null){
         this.mClientId = this.navParams.get('client_id');
          this.showSearchIcon = false;
      }
  }

  setPermissionData() {
    this.contactView = this.appConfig.hasUserPermissionByName('client_contact', 'view');
    this.contactCreate = this.appConfig.hasUserPermissionByName('client_contact', 'create');
    this.contactUpdate = this.appConfig.hasUserPermissionByName('client_contact', 'update');
    this.contactDelete = this.appConfig.hasUserPermissionByName('client_contact', 'delete');

    if (!this.contactDelete && !this.contactUpdate) {
      this.NoPermission = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    this.refreshData(false);
    this.getClientContactListData(true);

    this.eventsCtrl.subscribe('contact:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('contact:update', (itemData) => {
      //console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ClientContactEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('contact:delete');
    this.eventsCtrl.unsubscribe('contact:update');
  }

  scrollPage() {
    if (this.mPopoverListOption != null) {
      this.mPopoverListOption.dismiss();
    }
  }

  onAddClick() {
    this.navCtrl.push(ClientContactAddPage,{
      client_id: this.mClientId
    });
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
    this.mPopoverListOption = this.popoverCtrl.create(ClientContactPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    this.mPopoverListOption.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mClientContactList != null && this.mClientContactList.length > 0) {
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
    this.showNoTextMsg = false;
    this.refreshData(true);
    this.getClientContactListData(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData(false);
    this.getClientContactListData(true);
  }

  refreshData(search) {
    if (!search) {
      this.searchText = "";
      this.showSearchBar = false;
    }

    this.page = 1;
    this.total_items = 0;
    this.mClientContactList = [];
    this.showNoTextMsg = false;

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    if (this.mClientContactList.length < this.total_items) {
      this.page++;
      this.getClientContactListData(false);
    } else {
      this.mInfiniteScroll.complete();
      this.mInfiniteScroll.enable(false);

      this.appConfig.showToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000, true, "Ok", true);
    }
  }

  getClientContactListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.contactView) {
      if (this.appConfig.hasConnection()) {
        let token = this.appConfig.mUserData.user.api_token;

        if (showLoader) {
          this.appConfig.showLoading(this.appMsgConfig.Loading);
        }

        this.clientContactService.getClientContactList(token, this.searchText.trim(),this.mClientId,this.page).then(data => {

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
    } else {
      this.manageNoData();
    }
  }

  setClientListData(data) {
    // console.log(data);

    if (this.apiResult.totalitem != null && this.apiResult.totalitem != "") {
      this.total_items = this.apiResult.totalitem;
    }

    if (data.client_contacts != null && data.client_contacts.length > 0) {
      for (let i = 0; i < data.client_contacts.length; i++) {
        this.mClientContactList.push(data.client_contacts[i]);
      }
    }

    this.manageNoData();
  }
}

@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines (click)="editClientContact()" *ngIf="contactUpdate">Edit</button>
      <button ion-item no-lines (click)="confirmDeleteClientContact()" *ngIf="contactDelete">Delete</button>
    </ion-list>
  `
})

export class ClientContactPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;
  public contactUpdate: boolean = false;
  public contactDelete: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientContactService: ClientContactService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {
    this.contactUpdate = this.appConfig.hasUserPermissionByName('client_contact', 'update');
    this.contactDelete = this.appConfig.hasUserPermissionByName('client_contact', 'delete');

    if (this.navParams != null && this.navParams.data != null) {
      this.itemData = this.navParams.data.item;
      this.token = this.appConfig.mUserData.user.api_token;

      // console.log(this.itemData);
    }
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  editClientContact() {
    this.closePopover();

    this.eventsCtrl.publish('contact:update', this.itemData);
  }

  confirmDeleteClientContact() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.ClientContact,
      subTitle: this.appMsgConfig.ClientContactDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.deleteClientContact();
          }
        }]
    });

    this.mAlertDelete.present();
  }

  deleteClientContact() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        let post_param = {
          "api_token": this.token,
          "_method": "delete"
        };

        this.clientContactService.actionClientContact(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ClientContactDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('contact:delete');
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
