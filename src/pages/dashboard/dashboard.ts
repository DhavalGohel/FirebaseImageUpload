import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';
import { DashboardService } from '../../providers/dashboard/dashboard-service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {
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

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public dashboardService: DashboardService) {
    this.getDashboardData(true);
  }

  openPage(pageName) {
    console.log(pageName);
  }

  doChangeListType() {
    console.log("List Type : " + this.taskListType);
  }

  onTaskAdd() {
    console.log("Task Add Click.");
  }

  onTaskEdit(index) {
    console.log("Task Edit : " + index);
  }

  onTaskDelete(index) {
    console.log("Task Delete : " + index);
  }

  openConfirmCheckbox(index){
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
    this.mCountClients= 0;
    this.mCountDocuments = 0;
    this.mCountEmployees = 0;
    this.mCountOpenTask = 0;
    this.mCountOverDue = 0;

    this.mTaskListMy = [];
    this.mTaskListAll = [];
  }

  getDashboardData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading("Loading...");
      }

      this.dashboardService.getDashboardData(token).then(data => {
        if (data != null) {
          this.apiResult = data;

          if (this.apiResult.success) {
            this.setDashBoardData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg("Error", this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg("Error", "Network error occured.");
            }
          }
        } else {
          this.appConfig.showNativeToast("Network Error.", "bottom", 3000);
        }

        this.appConfig.hideLoading();
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg("Error", "Network error occured.");
      });
    } else {
      this.appConfig.showAlertMsg("Internet Connection", this.appConfig.internetConnectionMsg);
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
      } else {
        console.log("No data for all tasks list.");
      }

      if (data.tasks.my != null && data.tasks.my.length > 0) {
        this.mTaskListMy = data.tasks.my;
        console.log(this.mTaskListMy);
      } else {
        console.log("No data for my tasks list.");
      }
    }
  }
}
