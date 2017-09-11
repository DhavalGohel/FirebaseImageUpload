import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events, ModalController } from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {ClientDetailService} from '../../../providers/clientdetail-service/clientdetail-service';
import {DeactiveServiceModel} from '../../../pages/modals/deactive-service/deactive-service';
import {ActiveServiceModel } from '../../../pages/modals/active-service/active-service';
import {ServiceEditPage} from '../../../pages/service/edit/service-edit';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})

export class ServiceListPage {
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
  public showSearchIcon: boolean = true;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;
  public serviceView: boolean = false;
  public servicetUpdate: boolean = false;
  public serviceCreate: boolean = false;
  public serviceDelete: boolean = false;
  public NoPermission: boolean = false;
  public mDeactiveServiceModel: any;
  public mActiveServiceModel:  any;
  public mClientId: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientDetailService: ClientDetailService,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events,
    public modalCtrl: ModalController) {
    if (this.navParams.data.client_id != null && this.navParams.data.client_id != "") {
      this.mClientId = this.navParams.data.client_id;
      this.clientDetailService.setClientId(this.mClientId);
    }
  }

  setPermissionData() {
    this.serviceView = this.appConfig.hasUserPermissionByName('service', 'view');
    this.serviceCreate = this.appConfig.hasUserPermissionByName('service', 'create');
    this.servicetUpdate = this.appConfig.hasUserPermissionByName('service', 'update');
    this.serviceDelete = this.appConfig.hasUserPermissionByName('service', 'delete');

    if (!this.serviceDelete && !this.servicetUpdate) {
      this.NoPermission = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    this.refreshData(false);
    this.getClientContactListData(true);

    this.eventsCtrl.subscribe('service:deactive', (data) => {
      this.doRefresh(null);
    });
    this.eventsCtrl.subscribe('service:active', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('contact:update', (itemData) => {
      //console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(ServiceEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('service:deactive');
    this.eventsCtrl.unsubscribe('service:update');
    this.eventsCtrl.unsubscribe('service:active');

  }

  scrollPage() {
    if (this.mPopoverListOption != null) {
      this.mPopoverListOption.dismiss();
    }
  }

  onAddClick() {
    // this.navCtrl.push(ClientContactAddPage,{
    //   client_id: this.mClientId
    // });
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
    this.mPopoverListOption = this.popoverCtrl.create(ServicePopoverPage, {
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

    if (this.serviceView) {
      if (this.appConfig.hasConnection()) {
        let token = this.appConfig.mUserData.user.api_token;

        if (showLoader) {
          this.appConfig.showLoading(this.appMsgConfig.Loading);
        }

        this.clientDetailService.getClientContactList(token, this.page).then(data => {

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

    if (data.services != null && data.services.length > 0) {
      for (let i = 0; i < data.services.length; i++) {
        this.mClientContactList.push(data.services[i]);
      }
    }

    this.manageNoData();
  }
}

@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines (click)="editService()" *ngIf="servicetUpdate && itemData.status.toLowerCase() == 'on'">Edit</button>
      <button ion-item no-lines (click)="confirmDeactiveService()" *ngIf="itemData.status.toLowerCase() == 'on'">Deactive</button>
      <button ion-item no-lines (click)="confirmActiveService()" *ngIf="itemData.status.toLowerCase() == 'cancel'">Active</button>

    </ion-list>
  `
})

export class ServicePopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;
  public servicetUpdate: boolean = false;
  public serviceDelete: boolean = false;
  public mDeactiveServiceModel: any;
  public mActiveServiceModel:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientDetailService: ClientDetailService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public eventsCtrl: Events) {
    this.servicetUpdate = this.appConfig.hasUserPermissionByName('service', 'update');
    this.serviceDelete = this.appConfig.hasUserPermissionByName('service', 'deactive');

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

  editService() {
    this.closePopover();

    this.eventsCtrl.publish('contact:update', this.itemData);
  }

  confirmDeactiveService() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Services,
      subTitle: this.appMsgConfig.ServicesDeactiveConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.deactiveService();
          }
        }]
    });

    this.mAlertDelete.present();
  }

  confirmActiveService() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Services,
      subTitle: this.appMsgConfig.ServicesActiveConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.activeService();
          }
        }]
    });

    this.mAlertDelete.present();
  }


  deactiveService() {
    this.closePopover();
    this.mDeactiveServiceModel = this.modalCtrl.create(DeactiveServiceModel, { item: this.itemData }, { enableBackdropDismiss: false });
    this.mDeactiveServiceModel.present();
  }

  activeService() {
    this.closePopover();
    this.mActiveServiceModel = this.modalCtrl.create(ActiveServiceModel, { item: this.itemData }, { enableBackdropDismiss: false });
    this.mActiveServiceModel.present();
  }

}
