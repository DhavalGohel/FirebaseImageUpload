import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';


@Component({
  templateUrl: 'task-spent-time.html'
})

export class TaskSpentTimeModal {
  public mItemIndex: number;
  public mItemData: any;

  public task_time: string = "";
  public task_comment: string = "";
  public apiResult: any;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public eventCtrl: Events,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService) {
    this.mItemData = this.params.get('item');

    // console.log(this.mItemData);
  }

  dismiss() {
    if (this.viewCtrl != null) {
      this.viewCtrl.dismiss();
    }
  }

  validateSubmitData() {
    if (this.task_time == null || this.task_time == "") {
      this.appConfig.showAlertMsg("", this.appMsgConfig.TaskSpentTimeErrorTime);
    } else if (this.task_comment == null || this.task_comment == "") {
      this.appConfig.showAlertMsg("", this.appMsgConfig.TaskSpentTimeErrorComment);
    } else {
      let post_params = {
        "task_id": this.mItemData.id,
        "time": this.task_time,
        "comment": this.task_comment
      };

      this.actionTaskSpentTime(post_params);
    }
  }

  actionTaskSpentTime (post_params) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      let token = this.appConfig.mUserData.user.api_token;

      this.taskService.taskSpentTime(token, post_params).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.taskSpentTimeSuccess, "bottom", 3000);

            setTimeout(() => {
              this.eventCtrl.publish('task:load_data');
              this.dismiss();
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
