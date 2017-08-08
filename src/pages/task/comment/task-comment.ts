import { Component  } from '@angular/core';
import { NavController, NavParams, Events, ModalController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';

import { TaskCompleteModal } from '../../modals/task-complete/task-complete';
// import { TaskSpentTimeModal } from '../../modals/task-spent-time/task-spent-time';


@Component({
  selector: 'page-task-comment',
  templateUrl: 'task-comment.html'
})

export class TaskCommentPage {
  public api_token = this.appConfig.mToken;
  public mTaskId: string = "";
  public mTaskStatus: string = "";
  public mIsTaskCompleted: boolean = false;

  public apiResult: any;
  public mTaskDetail: any;
  public mTaskStageDD: any = [];
  public mTaskAssignToDD: any = [];

  public mRefresher: any;

  public clientSelectOptions = {
    title: 'ASSIGN TO',
    mode: 'md'
  };

  public TaskStageSelectOptions = {
    title: 'TASK STAGE',
    mode: 'md'
  }

  public taskUpdate: boolean = false;
  public taskDelete: boolean = false;
  public taskReopen: boolean = false;
  public taskAddSpentTime: boolean = false;
  public taskChangeAssignee: boolean = false;
  public hasPermissions: boolean = false;

  public mTaskCompleteModal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public eventsCtrl: Events,
    public modalCtrl: ModalController) {
  }

  setPermissionData() {
    this.taskUpdate = this.appConfig.hasUserPermissionByName('tasks', 'update');
    this.taskDelete = this.appConfig.hasUserPermissionByName('tasks', 'delete');
    this.taskReopen = this.appConfig.hasUserPermissionByName('tasks', 'reopen_task');
    this.taskAddSpentTime = this.appConfig.hasUserPermissionByName('tasks', 'add_spent_time');
    this.taskChangeAssignee = this.appConfig.hasUserPermissionByName('tasks', 'change_assignee');

    if (this.taskUpdate || this.taskDelete || this.taskAddSpentTime) {
      this.hasPermissions = true;
    }
  }

  ionViewDidEnter() {
    this.setPermissionData();

    if (this.navParams != null && this.navParams.data != null) {
      // console.log(this.navParams.data);

      if (this.navParams.data.item_id != null && this.navParams.data.item_id != "") {
        this.mTaskId = this.navParams.data.item_id;
      }

      if (this.mTaskId != null && this.mTaskId != "") {
        this.getTaskCommentDetail(true);
      }
    }

    this.eventsCtrl.subscribe('task_complete:refresh_data', (data) => {
      this.doRefresh(null);
    });
  }

  ionViewDidLeave() {
    this.eventsCtrl.unsubscribe('task_complete:refresh_data');

    setTimeout(() => {
      this.eventsCtrl.publish('task:load_data');
    }, 100);
  }

  onSubmitCommentData() {
    this.navCtrl.pop();
  }

  onCancelCommentData() {
    this.navCtrl.pop();
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getTaskCommentDetail(true);
  }

  refreshData() {
    this.mTaskDetail = null;

    this.mTaskStageDD = [];
    this.mTaskAssignToDD = [];
  }

  getTaskCommentDetail(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.taskService.getTaskCommentDetail(this.mTaskId, this.api_token).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          console.log(this.apiResult);

          if (this.apiResult.success) {
            this.setDropDowns(this.apiResult);

            if (this.apiResult.task != null) {
              this.mTaskDetail = this.apiResult.task;
              this.mTaskDetail.isChecked = false;

              if (this.mTaskDetail.status != null && this.mTaskDetail.status != "") {
                this.mTaskStatus = this.mTaskDetail.status;
                // console.log(this.mTaskStatus);

                if (this.mTaskStatus == "completed") {
                  this.mIsTaskCompleted = true;
                }
              }
            }
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
      this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
      this.navCtrl.pop();
    }
  }

  setDropDowns(data) {
    if (data.task_stages != null) {
      this.mTaskStageDD = this.appConfig.getFormattedArray(data.task_stages);
    }

    if (data.employee != null) {
      this.mTaskAssignToDD = this.appConfig.getFormattedArray(data.employee);
    }
  }

  openCompleteModal(item) {
    if (this.mTaskDetail.isChecked) {
      this.mTaskCompleteModal = this.modalCtrl.create(TaskCompleteModal, { item: item }, { enableBackdropDismiss: false });
      this.mTaskCompleteModal.present();
    }
  }

  taskStageChange() {
    let tempItem = this.appConfig.getItemFromDDArray(this.mTaskStageDD, this.mTaskDetail.account_service_task_category_id);

    if (tempItem != null) {
      if (tempItem.value.toString().toLowerCase() == "complete") {
        setTimeout(() => {
          let taskItem = {
            "id": this.mTaskId,
            "client_service_id": this.mTaskDetail.client_service_id
          }

          this.mTaskCompleteModal = this.modalCtrl.create(TaskCompleteModal, { item: taskItem }, { enableBackdropDismiss: false });
          this.mTaskCompleteModal.present();
        }, 500);
      } else {
        this.onTaskStageChange(tempItem.key);
      }
    } else {
      this.mTaskDetail.account_service_task_category_id = "";
    }
  }

  onTaskStageChange(stage_id) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.taskService.changeTaskStage(this.api_token, this.mTaskId, stage_id).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskAssigneeChangeSuccess, "bottom", 3000);

            setTimeout(() => {
              this.doRefresh(null);
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

  onClientChange() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "api_token": this.api_token
      };

      this.taskService.changeTaskAssignee(this.mTaskId, this.mTaskDetail.assign_id, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskAssigneeChangeSuccess, "bottom", 3000);

            setTimeout(() => {
              this.doRefresh(null);
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
