import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ViewController, Events, ActionSheetController, AlertController, ModalController, PopoverController, LoadingController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';

import { TaskEditPage } from '../../task/edit/task-edit';
import { TaskCompleteModal } from '../../modals/task-complete/task-complete';
import { TaskSpentTimeModal } from '../../modals/task-spent-time/task-spent-time';

@Component({
  selector: 'page-task-comment',
  templateUrl: 'task-comment.html'
})

export class TaskCommentPage {
  public api_token = this.appConfig.mToken;
  public mTaskId: string = "";
  public mTaskStatus: string = "";
  public mIsTaskCompleted: boolean = false;
  public mTaskComment: string = "";
  public isDataLoaded: boolean = false;

  public mTaskDocumentURL: string = "";
  public mTaskDocumentName: string = "";
  public fileTransfer: FileTransferObject = this.transfer.create();

  public apiResult: any;
  public mTaskDetail: any;
  public mTaskStageDD: any = [];
  public mTaskAssignToDD: any = [];
  public mTaskCommentList: any = [];

  public mRefresher: any;
  public mAlertConfirm: any;
  public mAlertBox: any;

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
  public mPopoverListOption: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public eventsCtrl: Events,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public camera: Camera,
    public transfer: FileTransfer,
    public file: File,
    public filePath: FilePath) {
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
        this.refreshData();
        this.getTaskCommentDetail(true);
      }
    }

    this.eventsCtrl.subscribe('task:update', (itemData) => {
      // console.log(itemData);

      if (itemData != null) {
        if (this.appConfig.hasConnection()) {
          this.navCtrl.push(TaskEditPage, {
            item_id: itemData.id
          });
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
        }
      }
    });

    this.eventsCtrl.subscribe('task_complete:refresh_data', (data) => {
      this.doRefresh(null);
    });
  }

  ionViewDidLeave() {
    this.eventsCtrl.unsubscribe('task:update');
    this.eventsCtrl.unsubscribe('task_complete:refresh_data');

    setTimeout(() => {
      this.eventsCtrl.publish('task:load_data');
    }, 100);
  }

  showInValidateErrorMsg(message) {
    this.mAlertBox = this.alertCtrl.create({
      title: "",
      subTitle: message,
      buttons: ['Ok']
    });

    this.mAlertBox.present();
  }

  validateTaskComment() {
    let isValid = true;

    if (this.mTaskComment == null || (this.mTaskComment != null && this.mTaskComment.trim() == '')) {
      isValid = false;
      this.showInValidateErrorMsg("Enter comment.");
    }

    return isValid;
  }

  onSubmitCommentData() {
    let isValid = true;

    if (!this.validateTaskComment()) {
      isValid = false;
    }

    if (isValid) {
      this.onSubmitTaskCommentData();
    }
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
    this.isDataLoaded = false;
    this.mTaskDetail = null;
    this.mTaskComment = "";
    this.mTaskDocumentURL = "";
    this.mTaskDocumentName = "";

    this.mTaskStageDD = [];
    this.mTaskAssignToDD = [];
    this.mTaskCommentList = [];
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
          this.isDataLoaded = true;
          console.log(this.apiResult);

          if (this.apiResult.success) {
            this.setDropDowns(this.apiResult);

            if (this.apiResult.task != null) {
              this.mTaskDetail = this.apiResult.task;
              this.mTaskDetail.isChecked = false;

              if (this.mTaskDetail.status != null && this.mTaskDetail.status != "") {
                this.mTaskStatus = this.mTaskDetail.status;

                if (this.mTaskStatus == "completed") {
                  this.mIsTaskCompleted = true;
                } else {
                  this.mIsTaskCompleted = false;
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
          this.isDataLoaded = true;
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.isDataLoaded = true;
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.isDataLoaded = true;

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

    if (data.comment != null) {
      if (data.comment.data != null && data.comment.data.length > 0) {
        for (let i = 0; i < data.comment.data.length; i++) {
          this.mTaskCommentList.push(data.comment.data[i]);
        }
      }
    }
  }

  presentPopover(myEvent) {
    this.mPopoverListOption = this.popoverCtrl.create(CommentTaskPopoverPage, {
      item: this.mTaskDetail
    }, { cssClass: 'custom-popover' });

    this.mPopoverListOption.present({
      ev: myEvent
    });
  }

  openCompleteModal(item) {
    if (this.mTaskDetail.isChecked) {
      this.mTaskCompleteModal = this.modalCtrl.create(TaskCompleteModal, { item: item }, { enableBackdropDismiss: false });

      this.mTaskCompleteModal.onDidDismiss((index) => {
        if (this.mTaskDetail != null) {
          this.mTaskDetail.isChecked = false;
        }
      });

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
            this.appConfig.showNativeToast(this.appMsgConfig.TaskCompleteSuccess, "bottom", 3000);

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

  confirmReopenTask() {
    this.mAlertConfirm = this.alertCtrl.create({
      title: this.appMsgConfig.Task,
      subTitle: this.appMsgConfig.TaskReopenConfirm,
      buttons: [{
        text: this.appMsgConfig.No
      }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.reopenTask();
          }
        }]
    });

    this.mAlertConfirm.present();
  }

  reopenTask() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "task_id": this.mTaskId
      };

      this.taskService.reopenCommentTask(this.api_token, this.mTaskId, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskReopenSuccess, "bottom", 3000);

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

  onSubmitTaskCommentData() {
    // console.log(this.mTaskDetail);

    if (this.mTaskDocumentURL == null || (this.mTaskDocumentURL != null && this.mTaskDocumentURL == '')) {
      this.submitCommentDataPost();
    } else {
      this.submitCommentDataWithDocument();
    }
  }

  clearSelectedDocument() {
    this.mTaskDocumentURL = "";
    this.mTaskDocumentName = "";
  }

  openCameraActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Document',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.DestinationType.FILE_URI);
        }
      }, {
          text: 'Use Camera',
          handler: () => {
            this.captureImage(this.camera.PictureSourceType.CAMERA, this.camera.DestinationType.FILE_URI);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }]
    });

    if (this.appConfig.isRunOnMobileDevice()) {
      actionSheet.present();
    } else {
      actionSheet.dismiss();
      this.showInValidateErrorMsg("Camera plugin does not work in browser.");
    }
  }

  captureImage(sourceType, destinationType) {
    if (this.appConfig.isRunOnMobileDevice()) {
      let cameraOption = {
        sourceType: sourceType,
        destinationType: destinationType,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true
      }

      this.camera.getPicture(cameraOption).then((resultData) => {
        if (destinationType == this.camera.DestinationType.DATA_URL) {
          this.mTaskDocumentURL = "data:image/jpeg;base64," + resultData;
        } else if (destinationType == this.camera.DestinationType.FILE_URI) {
          // console.log(resultData);

          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(resultData)
              .then(filePath => {
                // console.log(filePath);

                let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

                // console.log(correctPath);
                // console.log(currentName);
              });
          } else {
            var correctPath = resultData.substr(0, resultData.lastIndexOf('/') + 1);
            var currentName = resultData.substr(resultData.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

            // console.log(correctPath);
            // console.log(currentName);
          }
        }
      }, (err) => {
        // console.log(err);
        this.showInValidateErrorMsg(err);
      });
    } else {
      this.showInValidateErrorMsg("Camera plugin does not work in browser.");
    }
  }

  public createFileName() {
    return "img_" + new Date().getTime() + ".jpg";
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.mTaskDocumentName = newFileName;
      this.mTaskDocumentURL = this.pathForImage(newFileName);

      // console.log("imageName : " + this.mTaskDocumentName);
      // console.log("imagePath : " + this.mTaskDocumentURL);
    }, error => {
      this.showInValidateErrorMsg("Error while storing file.");
    });
  }

  submitCommentDataPost() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      let post_param = {
        "account_client_service_tasks_id": this.mTaskId,
        "assignee_id": this.mTaskDetail.assign_id,
        "comment": this.mTaskComment.trim(),
        "comment_flag": 1,
        "upload_document": ""
      };

      this.taskService.addTaskComment(this.api_token, this.mTaskId, post_param).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.TaskCommentSuccess, "bottom", 3000);

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

  submitCommentDataWithDocument() {
    let UPLOAD_URL = this.appConfig.API_URL + 'v2/ca/tasks/' + this.mTaskId + '?api_token=' + this.api_token;

    let uploadParams = {
      "account_client_service_tasks_id": this.mTaskId,
      "assignee_id": this.mTaskDetail.assign_id,
      "comment": this.mTaskComment.trim(),
      "comment_flag": 1,
      "upload_document": this.mTaskDocumentURL
    }

    let uploadOptions = {
      fileKey: "upload_document",
      fileName: this.mTaskDocumentName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: uploadParams
    };

    let mFileUploadLoader = this.loadingCtrl.create({
      duration: 30000,
      content: 'Uploading... 0%'
    });
    mFileUploadLoader.present();

    // Use the FileTransfer to upload the image
    this.fileTransfer.upload(this.mTaskDocumentURL, UPLOAD_URL, uploadOptions).then(data => {
      mFileUploadLoader.dismiss();

      if (data != null) {
        // console.log(data);

        let resp = JSON.parse(data.response);
        if (resp.success) {
          this.appConfig.showNativeToast(this.appMsgConfig.TaskCommentSuccess, "bottom", 3000);

          setTimeout(() => {
            this.doRefresh(null);
          }, 300);
        } else {
          if (resp.error != null && resp.error != "") {
            this.appConfig.showAlertMsg(this.appMsgConfig.Error, resp.error);
          } else {
            this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
          }
        }
      }
    }, err => {
      // console.log(err);

      mFileUploadLoader.dismiss();
      this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
    });

    this.fileTransfer.onProgress(progressEvent => {
      // console.log(progressEvent);

      if (progressEvent != null && progressEvent.lengthComputable) {
        mFileUploadLoader.data.content = "Uploading... " + Math.floor(progressEvent.loaded / progressEvent.total * 100) + "%";
        console.log("Uploading... " + Math.floor(progressEvent.loaded / progressEvent.total * 100) + "%");
      }
    });
  }

}

@Component({
  template: `
    <ion-list no-margin>
      <button ion-item no-lines *ngIf="taskUpdate" (click)="editTask()">Edit</button>
      <button ion-item no-lines *ngIf="taskAddSpentTime" (click)="taskAddSpendTime()">Add Spent Time</button>
    </ion-list>
  `
})

export class CommentTaskPopoverPage {
  public itemData: any;
  public apiResult: any;
  public token: string = "";

  public taskUpdate: boolean = false;
  public taskAddSpentTime: boolean = false;
  public hasPermissions: boolean = false;

  public mTaskSpentTimeModal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public eventsCtrl: Events,
    public modalCtrl: ModalController) {
    this.setPermissionData();

    if (this.navParams != null && this.navParams.data != null) {
      this.itemData = this.navParams.data.item;
      this.token = this.appConfig.mUserData.user.api_token;

      // console.log(this.itemData);
    }
  }

  setPermissionData() {
    this.taskUpdate = this.appConfig.hasUserPermissionByName('tasks', 'update');
    this.taskAddSpentTime = this.appConfig.hasUserPermissionByName('tasks', 'add_spent_time');

    if (this.taskUpdate || this.taskAddSpentTime) {
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

  taskAddSpendTime() {
    this.closePopover();

    this.openSpentTimeModal();
  }

  openSpentTimeModal() {
    this.mTaskSpentTimeModal = this.modalCtrl.create(TaskSpentTimeModal, { item: this.itemData }, { enableBackdropDismiss: false });
    this.mTaskSpentTimeModal.present();
  }

}
