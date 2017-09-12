import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';


@Component({
  templateUrl: 'task-multiple-action.html'
})

export class TaskMultipeActionModal {
  public mItemAction: string = "";
  public mItemData: any;
  public title: string = "Change Priority";

  public apiResult: any;

  public mEmployeeId: string = "";
  public mPriority: string = "";

  public mTaskAssignToDD: any = [];
  public mTaskPriorityDD: any = [];

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public eventsCtrl: Events,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService) {
    this.mItemData = this.params.get('item');
    this.mItemAction = this.params.get('action');

    // console.log(this.mItemIndex);
    // console.log(this.mItemData);
    this.onLoadGetData();
  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe("search-select:refresh_value", (data) => {
      this.onSearchSelectChangeValue(data);
    });
  }

  dismiss() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss(null);
      this.eventsCtrl.unsubscribe("search-select:refresh_value");
    }
  }
  onLoadGetData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      let token = this.appConfig.mUserData.user.api_token;

      this.taskService.getSearchDropDown(token).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast("Task data load successfully.", "bottom", 3000);
            this.setSearchData(this.apiResult);

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

  setSearchData(data) {
    if (data.priority != null && Object.keys(data.priority).length > 0) {
      this.mTaskPriorityDD = this.appConfig.getFormattedArray(data.priority);
    }
    if (data.employees != null && Object.keys(data.employees).length > 0) {
      this.mTaskAssignToDD = this.appConfig.getFormattedArray(data.employees);
    }
  }

  onSearchSelectChangeValue(data) {
    if (data.element.id == "txtPriority") {
      this.mPriority = data.data.key;
    } else if (data.element.id == "txtAssignTo") {
      this.mEmployeeId = data.data.key;
    }
  }

  onSubmit() {
    if (this.validateData()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
        let token = this.appConfig.mUserData.user.api_token;

        let post_params = {
          'action': this.mItemAction,
          'employee_id': this.mEmployeeId,
          'priority': this.mPriority,
        };

        this.taskService.multipleAction(token, post_params,this.mItemData).then(data => {
          if (data != null) {
            this.appConfig.hideLoading();

            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.TaskActionPerformed, "bottom", 3000);

              setTimeout(() => {
                this.eventsCtrl.publish('task:load_data');
                this.viewCtrl.dismiss(null);
              }, 500);
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
  }

  validateData() {
    let isValidate = true;
    if (this.mItemAction == "priority") {
      if (this.mPriority == null || (this.mPriority != null && this.mPriority == "")) {
        this.appConfig.showAlertMsg("", "Please select priority");
        isValidate = false;
      }
    } else {
      if (this.mEmployeeId == null || (this.mEmployeeId != null && this.mEmployeeId == "")) {
        this.appConfig.showAlertMsg("", "Please select employee");
        isValidate = false;
      }
    }
    return isValidate;
  }

}
