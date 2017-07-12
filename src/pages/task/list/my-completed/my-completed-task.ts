import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { TaskService } from '../../../../providers/task-service/task-service';
import { TaskAddPage } from '../../../task/add/task-add';

@Component({
  selector: 'page-my-completed-task',
  templateUrl: 'my-completed-task.html'
})

export class MyCompletedTaskListPage {
  public mInfiniteScroll: any;

  public status: string = "my_completed";
  public page: number = 1;
  public total_items: number = 0;

  public apiResult: any;
  public mTaskList = [];
  public showNoTextMsg: boolean = true;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public popoverCtrl: PopoverController,

    public eventsCtrl: Events) {
  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_data', (data) => {
      this.refreshData();
      this.getTaskList(true);
    });
    this.eventsCtrl.subscribe('task:delete', (data) => {
      console.log('my com delete resfresh');
      this.refreshData();
      this.getTaskList(true);
    });

    this.eventsCtrl.subscribe('task:update', (itemData) => {
      console.log(itemData);

      // if (itemData != null) {
      //   if (this.appConfig.hasConnection()) {
      //     this.navCtrl.push(TaskAddPage, {
      //       item_id: itemData.id
      //     });
      //   } else {
      //     this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
      //   }
      // }
    });
  }

  presentPopover(myEvent, item) {
    let popover = this.popoverCtrl.create(MyCompletedTaskPopoverPage, {
      item: item
    }, {cssClass: 'custom-popover'});

    popover.present({
      ev: myEvent
    });
  }

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('task:load_data');
    this.eventsCtrl.unsubscribe('task:update');
    this.eventsCtrl.unsubscribe('task:delete');
  }

  onAddClick() {
    this.navCtrl.push(TaskAddPage);

    // console.log("called.....");
  }

  openSearchPage() {
    // console.log("open search page");
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

    setTimeout(()=> {
      this.eventsCtrl.publish('task:load_counter_data', mCounterData);
    }, 0);
    // console.log(mCounterData);

    if (data.totalitems != null && data.totalitems != "") {
      this.total_items = data.totalitems;
    }

    if (data.tasks != null && data.tasks.length > 0) {
      for (let i = 0; i < data.tasks.length; i++) {
        data.tasks[i].isChecked = false;

        this.mTaskList.push(data.tasks[i]);
      }
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

}


@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines (click)="editTask()">Edit</button>
      <button ion-item no-lines (click)="confirmDeleteTask()">Delete</button>
    </ion-list>
  `
})

export class MyCompletedTaskPopoverPage {
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
    public taskService: TaskService,
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
