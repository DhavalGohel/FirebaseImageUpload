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
  public apiResult: any;
  public mClientContactList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientContactService: ClientContactService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
    this.getClientContactListData(true);
  }

  ionViewDidEnter() {
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

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('contact:delete');
    this.eventsCtrl.unsubscribe('contact:update');
  }

  onAddClick() {
    this.navCtrl.push(ClientContactAddPage);
  }

  toggleSearchIcon() {
    this.showSearchBar = !this.showSearchBar;

    if (this.showSearchBar) {
      setTimeout(() => {
        this.mSearchBar.setFocus();
      },300);
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

    setTimeout(()=> {
      this.getSearchData();
    }, 500);
  }

  presentPopover(myEvent, item) {
    let popover = this.popoverCtrl.create(ClientContactPopoverPage, {
      item: item
    }, {cssClass: 'custom-popover'});

    popover.present({
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

    this.mSearchTimer = setTimeout(()=> {
      this.getSearchData();
    }, this.mSearchTimeDelay);
  }

  getSearchData() {
    this.mClientContactList = [];
    this.showNoTextMsg = false;

    this.getClientContactListData(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getClientContactListData(true);
  }

  refreshData() {
    this.searchText = "";
    this.showSearchBar = false;

    this.mClientContactList = [];
    this.showNoTextMsg = false;
  }

  getClientContactListData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.clientContactService.getClientContactList(token, this.searchText.trim()).then(data => {
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
      <button ion-item no-lines (click)="editClientContact()">Edit</button>
      <button ion-item no-lines (click)="confirmDeleteClientContact()">Delete</button>
    </ion-list>
  `
})

export class ClientContactPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;

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
