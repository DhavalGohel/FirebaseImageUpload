import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { TaskService } from '../../../../providers/task-service/task-service';


@Component({
  selector: 'page-uploaded-document-list',
  templateUrl: 'uploaded-document-list.html'
})

export class TaskCommentUploadedDocPage {
  public api_token = this.appConfig.mToken;
  public mTaskId: string = "";

  public mRefresher: any;
  public apiResult: any;
  public mTaskCommentDetails: any;
  public mTaskDocumentList: any = [];
  public showNoTextMsg: boolean = false;


  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService) {
  }

  ionViewDidEnter() {
    if (this.navParams != null && this.navParams.data != null) {
      // console.log(this.navParams.data);

      if (this.navParams.data.comment_data != null && this.navParams.data.comment_data != "") {
        this.mTaskCommentDetails = this.navParams.data.comment_data;
        this.setCommentData(this.mTaskCommentDetails);
      }
    }
  }

  onClickItem(item) {
    console.log(item);
  }

  refreshData() {
    this.showNoTextMsg = false;
    this.mTaskCommentDetails = null;

    this.mTaskDocumentList = [];
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getTaskCommentDetail(true);
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
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.mTaskCommentDetails = this.apiResult;
            this.setCommentData(this.mTaskCommentDetails);
          } else {
            this.showNoTextMsg = true;

            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.showNoTextMsg = true;
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.showNoTextMsg = true;
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.showNoTextMsg = true;
      this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
    }
  }

  setCommentData(data) {
    if (data.task != null && data.task.length != "") {
      this.mTaskId = data.task.id;
    }

    if (data.upload_document != null && data.upload_document.length > 0) {
      this.showNoTextMsg = false;

      for (let i = 0; i < data.upload_document.length; i++) {
        this.mTaskDocumentList.push(data.upload_document[i]);
      }
    } else {
      this.showNoTextMsg = true;
    }
  }

}
