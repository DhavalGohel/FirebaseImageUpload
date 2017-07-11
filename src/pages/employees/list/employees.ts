import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, PopoverController, Events, ViewController, AlertController } from 'ionic-angular';
import { EmployeeService } from '../../../providers/employee/employee-service';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-employees',
  templateUrl: 'employees.html',
})

export class EmployeesPage {
  @ViewChild('searchBar') mSearchBar;

  public mRefresher: any;
  public mInfiniteScroll: any;
  public apiResult: any;
  public mEmployeesList: any = [];
  public showNoTextMsg: boolean = false;
  public searchText: string = "";
  public showSearchBar: boolean = false;

  public mSearchTimer: any;
  public mSearchTimeDelay = 1000;

  public page: number = 1;
  public totalItem: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public employeeService: EmployeeService,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
    this.getEmployeeList(true);
  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('employee:delete', (data) => {
      this.doRefresh(null);
    });

    this.eventsCtrl.subscribe('employee:update', (itemData) => {
      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          // this.navCtrl.push(EmployeeEditPage, {
          //   item_id: itemData.id
          // });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('employee:delete');
    this.eventsCtrl.unsubscribe('employee:update');
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
    let popover = this.popoverCtrl.create(EmployeeListPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    popover.present({
      ev: myEvent
    });
  }

  manageNoData() {
    if (this.mEmployeesList != null && this.mEmployeesList.length > 0) {
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
    this.mEmployeesList = [];
    this.showNoTextMsg = false;

    this.getEmployeeList(true);
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getEmployeeList(true);
  }

  refreshData() {
    this.searchText = "";
    this.showSearchBar = false;

    this.mEmployeesList = [];
    this.showNoTextMsg = false;
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    if (this.mEmployeesList.length < this.totalItem) {
      this.page++;
      this.getEmployeeList(false);
    } else {
      this.mInfiniteScroll.complete();
      this.mInfiniteScroll.enable(false);
      this.appConfig.showNativeToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000);
    }
  }

  getEmployeeList(showLoader) {

    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.employeeService.getEmployeeListData(token, this.page, this.searchText.trim()).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          if (this.apiResult.success) {
            this.setEmployeeListData(this.apiResult);
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

  setEmployeeListData(data) {

    if (data.employees != null && data.employees.length > 0) {
      for (let i = 0; i < data.employees.length; i++) {
        this.mEmployeesList.push(data.employees[i]);
      }
    }

    this.manageNoData();
  }

  onAddClick() {
    console.log("add clicked");
  }
}


@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines (click)="editClientGroup()">Edit</button>
      <button ion-item no-lines (click)="confirmDeleteEmployee()">Delete</button>
      <button ion-item no-lines (click)="terminateEmployee()">Terminate</button>
      <button ion-item no-lines (click)="generatePassword()">Generate Password</button>
    </ion-list>
  `
})

export class EmployeeListPopoverPage {
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
    public employeeService: EmployeeService,
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

  editClientGroup() {
    this.closePopover();

    this.eventsCtrl.publish('employee:update', this.itemData);
  }

  confirmDeleteClientGroup() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Employees,
      subTitle: this.appMsgConfig.EmployeesDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {

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
        let post_param = {
          "api_token": this.token,
        };

        this.employeeService.generatePassword(this.itemData.id, post_param).then(data => {
          if (data != null) {
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
