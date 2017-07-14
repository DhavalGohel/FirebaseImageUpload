import { Component } from '@angular/core';
import { NavController, NavParams, Tab, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { TaskService } from '../../../../providers/task-service/task-service';
import { TaskAddPage } from '../../add/task-add';
import { TaskEditPage } from '../../../task/edit/task-edit';
import { TaskSearchPage } from '../../../task/search/task-search';


@Component({
  selector: 'page-all-pending-task',
  templateUrl: 'all-pending-task.html'
})

export class AllPendingTaskListPage {
  public mCurrentTab: Tab;
  public mSelectedTabIndex: number = 0;

  public mInfiniteScroll: any;

  public status: string = "active";
  public page: number = 1;
  public total_items: number = 0;

  public apiResult: any;
  public mTaskList = [];
  public showNoTextMsg: boolean = true;

  public mClientListDD: any = [];
  public mSelectedClient: string = "";
  public clientSelectOptions = {
    title: 'ASSIGN TO',
    mode: 'md'
  };

  public mTaskCompletePrompt: any;

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
  public hasPermissions: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public eventsCtrl: Events,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController) {
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

    if (this.taskUpdate || this.taskDelete) {
      this.hasPermissions = true;
    }
  }

  ionViewDidEnter() {
    this.mCurrentTab = <Tab>this.navCtrl;
    this.mSelectedTabIndex = this.mCurrentTab.index;

    this.setPermissionData();

    this.eventsCtrl.subscribe('task:load_data', (data) => {
      this.refreshData();
      this.getTaskList(true);
    });

    this.eventsCtrl.subscribe('task:delete', (data) => {
      this.refreshData();
      this.getTaskList(true);
    });

    this.eventsCtrl.subscribe('task:update', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(TaskEditPage, {
            item_id: itemData.id,
            status: this.status,
            selectedTabIndex: this.mSelectedTabIndex
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });

    this.refreshData();
    this.getTaskList(true);
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('task:load_data');
    this.eventsCtrl.unsubscribe('task:update');
    this.eventsCtrl.unsubscribe('task:delete');
  }

  presentPopover(myEvent, item) {
    let popover = this.popoverCtrl.create(AllPendingTaskPopoverPage, {
      item: item
    }, { cssClass: 'custom-popover' });

    popover.present({
      ev: myEvent
    });
  }

  onAddClick() {
    this.navCtrl.push(TaskAddPage);
  }

  /*
  openConfirmCheckbox(index, item) {
    console.log("Index : "+index);
    console.log(item);
  }
  */

  openConfirmCheckbox(index, item) {
    this.mTaskCompletePrompt = this.alertCtrl.create({
      title: 'COMPLETE TASK',
      inputs: [{
        name: 'task_time',
        placeholder: 'Time',
        type: 'time'
      }, {
          name: 'task_comment',
          placeholder: 'Comment'
        }],
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: data => {
          this.mTaskCompletePrompt = null;
          this.mTaskList[index].isChecked = false;

          // console.log(this.mTaskList[index]);
        }
      }, {
          text: 'Yes',
          handler: data => {
            // console.log(data);

            this.actionTaskComplete(item, data);
            return true;
          }
        }]
    });

    this.mTaskCompletePrompt.present();
  }

  openSearchPage() {
    this.navCtrl.push(TaskSearchPage);
  }

  manageNoData() {
    if (this.mTaskList != null && this.mTaskList.length > 0) {
      this.showNoTextMsg = false;
    } else {
      this.showNoTextMsg = true;
    }
  }

  actionTaskComplete(item, data) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      let token = this.appConfig.mUserData.user.api_token;

      let post_params = {
        "task_id": item.id,
        "task_client_service_id": item.client_service_id,
        "task_time": data.task_time,
        "task_comment": data.task_comment
      };

      this.taskService.taskComplete(token, post_params).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskCompleteSuccess, "bottom", 3000);

            setTimeout(()=>{
              this.refreshData();
              this.getTaskList(true);
            },500);
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
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  getTaskList(showLoader) {
    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.taskService.getTaskList(token, this.status, this.page).then(data => {
        if (this.mInfiniteScroll != null) {
          this.mInfiniteScroll.complete();
        }

        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.setTaskListData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }

            this.manageNoData();
          }
        } else {
          this.manageNoData();
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.manageNoData();
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.manageNoData();
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setTaskListData(data) {
    // console.log(data);

    let mCounterData: any = {
      all_pending_tasks: '0',
      all_completed_tasks: '0',
      my_pending_tasks: '0',
      my_completed_tasks: '0'
    };

    if (data.all_pending_tasks != null && data.all_pending_tasks != "") {
      mCounterData.all_pending_tasks = data.all_pending_tasks;
    }

    if (data.all_completed_tasks != null && data.all_completed_tasks != "") {
      mCounterData.all_completed_tasks = data.all_completed_tasks;
    }

    if (data.my_pending_tasks != null && data.my_pending_tasks != "") {
      mCounterData.my_pending_tasks = data.my_pending_tasks;
    }

    if (data.my_completed_tasks != null && data.my_completed_tasks != "") {
      mCounterData.my_completed_tasks = data.my_completed_tasks;
    }

    setTimeout(() => {
      this.eventsCtrl.publish('task:load_counter_data', mCounterData);
    }, 0);

    if (data.totalitems != null && data.totalitems != "") {
      this.total_items = data.totalitems;
    }

    if (data.tasks != null && data.tasks.length > 0) {
      for (let i = 0; i < data.tasks.length; i++) {
        data.tasks[i].isChecked = false;

        this.mTaskList.push(data.tasks[i]);
      }
    }

    if (data.employees != null) {
      let mClientList = [];

      Object.keys(data.employees).forEach(function(key) {
        mClientList.push({ 'key': key, 'value': data.employees[key] });
      });

      this.mClientListDD = mClientList;
    }

    this.manageNoData();
  }

  refreshData() {
    this.page = 1;
    this.total_items = 0;
    this.mTaskList = [];

    this.manageNoData();

    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    // console.log("Total Data : " + this.total_items);
    // console.log("Product Data : " + this.mTaskList.length);

    if (this.mTaskList.length < this.total_items) {
      this.page++;
      this.getTaskList(false);
    } else {
      this.mInfiniteScroll.complete();
      this.mInfiniteScroll.enable(false);

      this.appConfig.showToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000, true, "Ok", true);
    }
  }

  onClientChange(index, task_id, assignee_id) {
    // console.log(this.mTaskList[index]);
    // console.log(task_id);
    // console.log(assignee_id);

    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "api_token": this.appConfig.mUserData.user.api_token
      };

      this.taskService.changeTaskAssignee(task_id, assignee_id, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskAssigneeChangeSuccess, "bottom", 3000);

            setTimeout(() => {
              this.refreshData();
              this.getTaskList(true);
            }, 300);
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

}

@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines *ngIf="taskUpdate" (click)="editTask()">Edit</button>
      <button ion-item no-lines *ngIf="taskDelete" (click)="confirmDeleteTask()">Delete</button>
    </ion-list>
  `
})

export class AllPendingTaskPopoverPage {
  public itemData: any;
  public token: string = "";
  public mAlertDelete: any;
  public apiResult: any;

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
  public hasPermissions: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events) {
      this.setPermissionData();

      if (this.navParams != null && this.navParams.data != null) {
        this.itemData = this.navParams.data.item;
        this.token = this.appConfig.mUserData.user.api_token;
        // console.log(this.itemData);
      }
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

    if (this.taskUpdate || this.taskDelete) {
      this.hasPermissions = true;
    }
  }

  closePopover() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  editTask() {
    this.closePopover();

    this.eventsCtrl.publish('task:update', this.itemData);
  }

  confirmDeleteTask() {
    this.closePopover();

    this.mAlertDelete = this.alertCtrl.create({
      title: this.appMsgConfig.Task,
      subTitle: this.appMsgConfig.TaskDeleteConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.deleteTask();
          }
        }]
    });

    this.mAlertDelete.present();
  }

  deleteTask() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      if (this.itemData != null) {
        let post_param = {
          "api_token": this.token,
          "_method": "delete"
        };

        this.taskService.actionTask(this.itemData.id, post_param).then(data => {
          if (data != null) {
            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.TaskDeleteSuccess, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('task:delete');
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
