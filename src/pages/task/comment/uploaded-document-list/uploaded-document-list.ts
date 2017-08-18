import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../../providers/AppConfig';
import { TaskService } from '../../../../providers/task-service/task-service';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

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

  public fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    private file: File,
    private transfer: FileTransfer,
    private fileOpener: FileOpener) {
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

  onClickItem(item, folderName) {
    // console.log(item);

    if (item.uploaded_path != null && item.uploaded_path != "") {
      if (this.appConfig.hasConnection()) {
        if (this.appConfig.isRunOnMobileDevice()) {
          let fileURL = this.appConfig.WEB_URL + "/" + item.uploaded_path;
          let fileName = this.getExtenstionFromFile(fileURL, false);
          let fileExtension = this.getExtenstionFromFile(fileURL, true);

          let rootPath = "";
          let downloadPath = "";

          if (this.appConfig.isRunOnIos()) {
            rootPath = this.file.dataDirectory;
          } else {
            rootPath = this.file.externalApplicationStorageDirectory;
          }

          downloadPath = rootPath + folderName + "/" + fileName;

          this.file.createDir(rootPath, folderName, true).then((link) => {
            this.appConfig.showLoading(this.appMsgConfig.Loading);

            this.fileTransfer.download(fileURL, downloadPath).then((entry) => {
              // console.log(entry);

              this.appConfig.hideLoading();
              this.openDownloadFile(entry.toURL(), fileExtension);
            }, (error) => {
              this.appConfig.hideLoading();
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            });

            this.fileTransfer.onProgress(progressEvent => {
              // console.log(progressEvent);

              if (progressEvent != null && progressEvent.lengthComputable) {
                // console.log("Downloading... " + Math.floor(progressEvent.loaded / progressEvent.total * 100) + "%");
              }
            });
          }, function(error) {
            this.appConfig.hideLoading();
          });
        }
      } else {
        this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
      }
    }
  }

  getExtenstionFromFile(file, onlyExt) {
    let filename = "";

    if (onlyExt) {
      filename = file.substring(file.lastIndexOf(".") + 1);
    } else {
      filename = file.substring(file.lastIndexOf("/") + 1);
    }

    return filename;
  }

  openDownloadFile(url, type) {
    let MIME = ['jpg', 'jpeg', 'png'];
    let PDFMIME = 'pdf';
    let MIMEtype = "application/*";

    if (type != null && type != "") {
      if (MIME.indexOf(type) > -1) {
        MIMEtype = 'image/*';
      } else if (PDFMIME == type.toLowerCase()) {
        MIMEtype = 'application/pdf';
      }
    }

    this.fileOpener.open(url, MIMEtype).then(function() {
      console.log("success");
    }, function(err) {
      console.log("error : ", err);
    });
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
