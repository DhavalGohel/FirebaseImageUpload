
import { Component  } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import {TaskService} from '../../../providers/task-service/task-service';
import {TaskListPage} from '../../task/list/task-list';
@Component({
  selector: 'page-task-add',
  templateUrl: 'task-add.html'
})

export class TaskAddPage {

  public mRefresher: any;

  public apiResult: any;

  public mAlertBox: any;
  public api_token = this.appConfig.mToken;
  public mTaskClientDD: any = [];

  public mTaskStageDD: any = [];
  public mTaskPriorityDD: any = [];
  public mTaskAssignToDD: any = [];

  public task: any = {
    account_service_task_category_id: "0",
    client_id: "0",
    priority: "",
    assign_id: "0",
    overdue_days: "",
    name: "",
    api_token: this.api_token
  };


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService) {
    this.getTaskDropDownData(true);
  }

  onClientChange() {
    console.log(this.task.client_id);
  }
  onStageChange() {
    console.log(this.task.account_service_task_category_id);
  }
  onPriorityChange() {
    console.log(this.task.priority);
  }
  onAssignToChange() {
    console.log(this.task.assign_id);
  }

  onClickAddTask() {
    let isValid = true;

    if (!this.validatePriority()) {
      this.showInValidateErrorMsg("Select priority.");
      isValid = false;
    }
    else if (!this.validateDescription()) {
      this.showInValidateErrorMsg("Enter description.");
      isValid = false;
    }
    else {

      this.onClickAddTaskData();
    }
  }

  onClickAddTaskData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      console.log(this.task);
      this.taskService.addTask(this.task).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskAddSuccess, "bottom", 3000);

            setTimeout(() => {
              this.navCtrl.setRoot(TaskListPage);
            }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else if (this.apiResult.name != null && this.apiResult.name.length > 0) {
              this.appConfig.showAlertMsg("", this.apiResult.name[0]);
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

  validateDescription() {
    let isValid = true;

    if (this.task.name.trim() == "") {
      isValid = false;
    }

    return isValid;
  }

  validatePriority() {
    let isValid = true;
    if (this.task.priority.trim() == "") {
      isValid = false;
    }
    return isValid;
  }
  getTaskDropDownData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.taskService.getTaskDropDown(token).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          if (this.apiResult.success) {
            this.setClientContactDD(this.apiResult);
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
      //  this.manageNoData();
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }
  setClientContactDD(data) {
    console.log(data);

    if (data.client != null) {
      let mTaskClientDD = [];

      Object.keys(data.client).forEach(function(key) {
        mTaskClientDD.push({ 'key': key, 'value': data.client[key] });
      });

      this.mTaskClientDD = mTaskClientDD;
    }
    if (data.category != null) {
      let mTaskStageDD = [];

      Object.keys(data.category).forEach(function(key) {
        mTaskStageDD.push({ 'key': key, 'value': data.category[key] });
      });

      this.mTaskStageDD = mTaskStageDD;
    }

    if (data.priority != null) {
      let mTaskPriorityDD = [];

      Object.keys(data.priority).forEach(function(key) {
        mTaskPriorityDD.push({ 'key': key, 'value': data.priority[key] });
      });

      this.mTaskPriorityDD = mTaskPriorityDD;
    }

    if (data.asign_to != null) {
      let mTaskAssignToDD = [];

      Object.keys(data.asign_to).forEach(function(key) {
        mTaskAssignToDD.push({ 'key': key, 'value': data.asign_to[key] });
      });

      this.mTaskAssignToDD = mTaskAssignToDD;
    }
  }
  showInValidateErrorMsg(message) {
    this.mAlertBox = this.alertCtrl.create({
      title: "",
      subTitle: message,
      buttons: ['Ok']
    });

    this.mAlertBox.present();
  }


}
