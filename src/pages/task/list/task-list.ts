import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs, Events } from 'ionic-angular';

import { AllPendingTaskListPage } from '../list/all-pending/all-pending-task';
import { AllCompletedTaskListPage } from '../list/all-completed/all-completed-task';
import { MyPendingTaskListPage } from '../list/my-pending/my-pending-task';
import { MyCompletedTaskListPage } from '../list/my-completed/my-completed-task';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';


@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html'
})

export class TaskListPage {
  @ViewChild('taskListTabs') TaskListTabs: Tabs;

  public tabSelected: number = 0;
  public tabAllPendingTask: any = AllPendingTaskListPage;
  public tabAllCompletedTask: any = AllCompletedTaskListPage;
  public tabMyPendingTask: any = MyPendingTaskListPage;
  public tabMyCompletedTask: any = MyCompletedTaskListPage;

  public apiResult: any;
  public mCountAllPendingTask: string = "0";
  public mCountAllCompletedTask: string = "0";
  public mCountMyPendingTask: string = "0";
  public mCountMyCompletedTask: string = "0";

  public tabTitleAllPending = "ALL PENDING (0)";
  public tabTitleAllCompleted = "ALL COMPLETED (0)";
  public tabTitleMyPending = "MY PENDING (0)";
  public tabTitleMyCompleted = "MY COMPLETED (0)";
  public isPageLoaded = false;

  public taskView: boolean = false;
  public taskUpdate: boolean = false;
  public taskDelete: boolean = false;
  public taskAllCompletedTasks: boolean = false;
  public taskAllPendingTasks: boolean = false;
  public taskReopen: boolean = false;
  public taskAddSpentTime: boolean = false;
  public taskListTimeLog: boolean = false;
  public taskCalendar: boolean = false;
  public taskChangeAssignee: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public eventsCtrl: Events) {
      // this.getTaskCounterData(true);
  }

  setPermissionData(){
    this.taskView = this.appConfig.hasUserPermissionByName('tasks','view');
    this.taskUpdate = this.appConfig.hasUserPermissionByName('tasks','update');
    this.taskDelete = this.appConfig.hasUserPermissionByName('tasks','delete');
    this.taskAllCompletedTasks = this.appConfig.hasUserPermissionByName('tasks','all_completed_tasks');
    this.taskAllPendingTasks = this.appConfig.hasUserPermissionByName('tasks','all_pending_tasks');
    this.taskReopen = this.appConfig.hasUserPermissionByName('tasks','reopen_task');
    this.taskAddSpentTime = this.appConfig.hasUserPermissionByName('tasks','add_spent_time');
    this.taskListTimeLog = this.appConfig.hasUserPermissionByName('tasks','list_time_log');
    this.taskCalendar = this.appConfig.hasUserPermissionByName('tasks','calendar');
    this.taskChangeAssignee = this.appConfig.hasUserPermissionByName('tasks','change_assignee');
  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_counter_data', (data) => {
      this.setTaskCounterData(data);
    });

    this.setPermissionData();

    /*
    if (this.navParams.data != null) {
      if (this.navParams.data.selectedTabIndex != null && this.navParams.data.selectedTabIndex != "") {
        this.tabSelected = this.navParams.data.selectedTabIndex;
        // this.TaskListTabs.select(this.tabSelected);
      } else {
        this.tabSelected = 0;
      }
    } else {
      this.tabSelected = 0;
    }
    */
  }

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('task:load_counter_data');
  }

  /*
  onSelectTab() {
    if (this.isPageLoaded) {
      setTimeout(()=> {
        this.eventsCtrl.publish('task:load_data');
      }, 500);
    } else {
      console.log("Page is not loaded....");
    }
  }
  */

  onSelectTab() {
    /*
    setTimeout(()=> {
      this.eventsCtrl.publish('task:load_data');
    }, 500);
    */
  }

  getTaskCounterData(showLoader) {
    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.taskService.getTaskCounterData(token).then(data => {
        if (data != null) {
          this.apiResult = data;

          if (this.apiResult.success) {
            this.setTaskCounterData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }

            this.isPageLoaded = true;
          }
        } else {
          this.isPageLoaded = true;
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }

        this.appConfig.hideLoading();
      }, error => {
        this.isPageLoaded = true;
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.isPageLoaded = true;
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setTaskCounterData(data) {
    if (data.all_pending_tasks != null && data.all_pending_tasks != "") {
      this.mCountAllPendingTask = data.all_pending_tasks;
      this.tabTitleAllPending = 'ALL PENDING (' + this.mCountAllPendingTask + ')';
    }

    if (data.all_completed_tasks != null && data.all_completed_tasks != "") {
      this.mCountAllCompletedTask = data.all_completed_tasks;
      this.tabTitleAllCompleted = 'ALL COMPLETED (' + this.mCountAllCompletedTask + ')';
    }

    if (data.my_pending_tasks != null && data.my_pending_tasks != "") {
      this.mCountMyPendingTask = data.my_pending_tasks;
      this.tabTitleMyPending = 'MY PENDING (' + this.mCountMyPendingTask + ')';
    }

    if (data.my_completed_tasks != null && data.my_completed_tasks != "") {
      this.mCountMyCompletedTask = data.my_completed_tasks;
      this.tabTitleMyCompleted = 'MY COMPLETED (' + this.mCountMyCompletedTask + ')';
    }

    // this.isPageLoaded = true;
    // this.onSelectTab();
  }
}
