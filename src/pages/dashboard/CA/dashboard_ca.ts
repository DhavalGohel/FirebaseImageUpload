import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { DashboardService } from '../../../providers/dashboard/dashboard-service';
import { TaskService } from '../../../providers/task-service/task-service';

import { TaskListPage } from '../../task/list/task-list';
import { TaskAddPage } from '../../task/add/task-add';
import { TaskEditPage } from '../../task/edit/task-edit';
import { EmployeesPage } from '../../employees/list/employees';
import { ClientListPage } from '../../client/list/client';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard_ca.html'
})


export class DashboardCAPage {
  public mRefresher: any;
  public mAlertDelete: any;

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

  public taskView: boolean = false;
  public taskUpdate: boolean = false;
  public taskDelete: boolean = false;
  public taskCreate: boolean = false;
  public taskAllList: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public dashboardService: DashboardService,
    public taskService: TaskService,
    public alertCtrl: AlertController,
    public eventCtrl: Events) {
    this.eventCtrl.publish('menu:update');
  }

  ionViewDidEnter() {
    this.setPermissionData();
    this.getDashboardData(true);
  }

  setPermissionData() {
    this.taskView = this.appConfig.hasUserPermissionByName('tasks', 'view');
    this.taskUpdate = this.appConfig.hasUserPermissionByName('tasks', 'update');
    this.taskDelete = this.appConfig.hasUserPermissionByName('tasks', 'delete');
    this.taskCreate = this.appConfig.hasUserPermissionByName('tasks', 'create');
    this.taskAllList = this.appConfig.hasUserPermissionByName('tasks', 'all_pending_tasks');
  }

  openPage(pageName) {
    // console.log(pageName);

    if (pageName == "clients") {
      this.navCtrl.setRoot(ClientListPage);
    } else if (pageName == 'open_task') {
      this.navCtrl.setRoot(TaskListPage, {
        selectedTabIndex: 0
      });
    } else if (pageName == "employees") {
      this.navCtrl.setRoot(EmployeesPage);
    }
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
    this.navCtrl.push(TaskAddPage);
  }

  onTaskEdit(item) {
    if (item != null) {
      // console.log(item);

      if (item != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(TaskEditPage, {
            item_id: item.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
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

    if (this.taskView) {
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
    } else {
      this.manageHideShowBtn();
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
        // console.log(this.mTaskListAll);
      }

      if (data.tasks.my != null && data.tasks.my.length > 0) {
        this.mTaskListMy = data.tasks.my;
        // console.log(this.mTaskListMy);
      }

      this.manageHideShowBtn();
    }
  }
}
