import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { DashboardService } from '../../../providers/dashboard/dashboard-service';
import { TaskService } from '../../../providers/task-service/task-service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard_ca.html'
})


export class DashboardCAPage {
  public mRefresher: any;

  public taskListType: string = "my";
  public mTaskListAll: any = [];
  public mTaskListMy: any = [];

  public apiResult: any;
  public mCountClients: number = 0;
  public mCountDocuments: number = 0;
  public mCountEmployees: number = 0;
  public mCountOpenTask: number = 0;
  public mCountOverDue: number = 0;

  public showMoreBtn: boolean = false;
  public showNoTextMsg: boolean = false;
  public mAlertDelete: any;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public dashboardService: DashboardService,
    public taskService: TaskService,
    public alertCtrl: AlertController) {
    this.getDashboardData(true);
  }

  openPage(pageName) {
    console.log(pageName);
  }

  doChangeListType() {
    // console.log("List Type : " + this.taskListType);

    this.showMoreBtn = false;
    this.showNoTextMsg = false;

    this.manageHideShowBtn();
  }

  manageHideShowBtn() {
    let mTempListData: any = [];

    if (this.taskListType == 'my') {
      mTempListData = this.mTaskListMy;
    } else if (this.taskListType == 'all') {
      mTempListData = this.mTaskListAll;
    }

    if (mTempListData != null && mTempListData.length > 0) {
      this.showMoreBtn = true;
      this.showNoTextMsg = false;
    } else {
      this.showMoreBtn = false;
      this.showNoTextMsg = true;
    }
  }

  onTaskAdd() {
    console.log("Task Add Click.");
  }

  onTaskEdit(item) {
    if (item != null) {
      console.log(item);
      console.log("Task Edit : " + item.id);
    }
  }

  onTaskDelete(item) {
    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Task,
      subTitle: this.appMsgConfig.TaskDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.doTaskDelete(item);
          }
        }]
    });

    this.mAlertDelete.present();
  }

  doTaskDelete(item) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (item != null) {
        let post_param = {
          "api_token": this.appConfig.mUserData.user.api_token,
          "_method": "delete"
        };
        // console.log(post_param);
        // console.log(item.id);

        this.taskService.deleteTask(item.id, post_param).then(data => {
          if (data != null) {
            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.TaskDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.doRefresh(null);
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

  openConfirmCheckbox(index) {
    console.log("Confirm : " + index);
  }

  onClickMore() {
    console.log("clicked on more text.");
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getDashboardData(true);
  }

  refreshData() {
    this.mCountClients = 0;
    this.mCountDocuments = 0;
    this.mCountEmployees = 0;
    this.mCountOpenTask = 0;
    this.mCountOverDue = 0;

    this.mTaskListMy = [];
    this.mTaskListAll = [];
    this.showMoreBtn = false;
    this.showNoTextMsg = false;
  }

  getDashboardData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.dashboardService.getDashboardData(token).then(data => {
        if (data != null) {
          this.apiResult = data;

          if (this.apiResult.success) {
            this.setDashBoardData(this.apiResult);
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
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setDashBoardData(data) {
    // console.log(data);

    if (data.clients != null && data.clients != "") {
      this.mCountClients = data.clients;
    }

    if (data.documents != null && data.documents != "") {
      this.mCountDocuments = data.documents;
    }

    if (data.employees != null && data.employees != "") {
      this.mCountEmployees = data.employees;
    }

    if (data.open_task != null && data.open_task != "") {
      this.mCountOpenTask = data.open_task;
    }

    if (data.overdue != null && data.overdue != "") {
      this.mCountOverDue = data.overdue;
    }

    if (data.tasks != null) {
      // console.log(data.tasks);

      if (data.tasks.all != null && data.tasks.all.length > 0) {
        this.mTaskListAll = data.tasks.all;
        console.log(this.mTaskListAll);
      }

      if (data.tasks.my != null && data.tasks.my.length > 0) {
        this.mTaskListMy = data.tasks.my;
        console.log(this.mTaskListMy);
      }

      this.manageHideShowBtn();
    }
  }
}
