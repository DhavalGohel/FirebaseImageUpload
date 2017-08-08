import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';


@Component({
  templateUrl: 'task-complete.html'
})

export class TaskCompleteModal {
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
    this.mItemIndex = this.params.get('index');
    this.mItemData = this.params.get('item');

    console.log(this.mItemIndex);
    console.log(this.mItemData);
  }

  dismiss() {
    if (this.viewCtrl != null) {
      // this.viewCtrl.dismiss(this.mItemIndex, this.mItemData);

      this.viewCtrl.dismiss(this.mItemIndex);
    }
  }

  onSubmit() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      let token = this.appConfig.mUserData.user.api_token;

      let post_params = {
        "task_id": this.mItemData.id,
        "task_client_service_id": this.mItemData.client_service_id,
        "task_time": this.task_time,
        "task_comment": this.task_comment
      };

      this.taskService.taskComplete(token, post_params).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskCompleteSuccess, "bottom", 3000);

            setTimeout(() => {
              this.eventCtrl.publish('task_complete:refresh_data');
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
