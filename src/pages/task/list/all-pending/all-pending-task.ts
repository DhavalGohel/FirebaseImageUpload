import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { TaskService } from '../../../../providers/task-service/task-service';


@Component({
  selector: 'page-all-pending-task',
  templateUrl: 'all-pending-task.html'
})

export class AllPendingTaskListPage {
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

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public eventsCtrl: Events) {

  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_data', (data) => {
      this.refreshData();
      this.getTaskList(true);
    });
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe('task:load_data');
  }

  onAddClick() {
    // console.log("called...");
  }

  openConfirmCheckbox(index) {
    // console.log("Confirm : " + index);
  }

  manageNoData() {
    if (this.mTaskList != null && this.mTaskList.length > 0) {
      this.showNoTextMsg = false;
    } else {
      this.showNoTextMsg = true;
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
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }

        this.appConfig.hideLoading();
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

  setTaskListData(data) {
    console.log(data);

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

  onClientChange(index) {
    console.log("change at " + index);
    console.log(this.mTaskList[index]);
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

}
