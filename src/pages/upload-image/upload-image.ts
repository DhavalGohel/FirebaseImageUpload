import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController,Platform } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AppConfig } from '../../providers/AppConfig';

@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html',
})
export class UploadImagePage {
  public imagePath: string = "";
  public imageName: string = "";
  public showUpload: boolean = false;
  public fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public platform : Platform,
    public camera: Camera,
    public transfer: FileTransfer,
    public file: File,
    public photoViewer: PhotoViewer,
    public filePath: FilePath,
    public appConfig : AppConfig) {
      this.imagePath = "assets/img/img-icon.png";
      this.imageName = "img-icon.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadImagePage');
  }


  isRunOnMobileDevice() {
    return this.platform.is('mobile') ? true : false;
  }

  openCameraActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
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

    if (this.isRunOnMobileDevice()) {
      actionSheet.present();
    } else {
      actionSheet.dismiss();
      this.appConfig.showToast("Camera plugin does not work in browser.", "bottom", 3000, true, "Ok", true);
    }
  }

  captureImage(sourceType, destinationType) {
    if (this.isRunOnMobileDevice()) {
      let cameraOption = {
        // allowEdit: true,
        sourceType: sourceType, // this.camera.PictureSourceType.CAMERA,
        destinationType: destinationType, // this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true,
        // saveToPhotoAlbum: true
      }

      this.camera.getPicture(cameraOption).then((resultData) => {
        if (destinationType == this.camera.DestinationType.DATA_URL) {
          this.imagePath = "data:image/jpeg;base64," + resultData;
        } else if (destinationType == this.camera.DestinationType.FILE_URI) {
          console.log(resultData);

          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(resultData)
              .then(filePath => {

                let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

              });
          } else {
            var correctPath = resultData.substr(0, resultData.lastIndexOf('/') + 1);
            var currentName = resultData.substr(resultData.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

          }
        }
      }, (err) => {
        console.log(err);

        this.appConfig.showToast(err, "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast("Camera plugin does not work in browser.", "bottom", 3000, true, "Ok", true);
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
      this.imageName = newFileName;
      this.imagePath = this.pathForImage(newFileName);
      this.showUpload = true;

      console.log("imageName : " + this.imageName);
      console.log("imagePath : " + this.imagePath);
    }, error => {
      this.appConfig.showToast('Error while storing file.', "bottom", 3000, true, "Ok", true);
    });
  }

  public uploadImage() {
    // Destination URL
    let UPLOAD_URL = "";

    let uploadParams = {
      'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE4MiwiaXNzIjoiaHR0cHM6XC9cL3d3dy5hZGR0b2J1eS5jb21cL2FwaVwvbG9naW4iLCJpYXQiOjE0OTgyOTE0NzQsImV4cCI6MTU2MTM2MzQ3NCwibmJmIjoxNDk4MjkxNDc0LCJqdGkiOiI1NmEzY2IxM2I0OWFlNzdiZmE3NDdjYWE3OWQ0Mzk0NyJ9.bNYrAwS6yykDFFj1LCQu40e2nC3tKVaGCa57s5qCld8',
      'full_name': 'mansi antani',
      'name' : 'manasi.antani@sphererays.net',
      'state_id' : '7',
      'city_id' : '299',
      'gender' : '0',
      'birth_date' : '2017-02-02',
      'merital_status' : '2',
      'anniversory_date' : '2016-10-06',
      'spouse_birth_date' : '2016-08-05',
      'bf_birth_date' : '',
      'status' : '1',
      'filename' : 'old_image.jpg',
      'email' : 'manasi.antani@sphererays.net'
    }

    let uploadOptions = {
      fileKey: "profile_image",
      fileName: this.imageName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: uploadParams
    };

    this.appConfig.showLoading('Uploading...');

    // Use the FileTransfer to upload the image
    this.fileTransfer.upload(this.imagePath, UPLOAD_URL, uploadOptions).then(data => {
      this.appConfig.hideLoading();

      if (data != null) {

        let resp = JSON.parse(data.response);
        this.appConfig.showToast(resp.message, "bottom", 3000, true, "Ok", true);
      }
    }, err => {

      this.appConfig.hideLoading();
      this.appConfig.showToast('Error while uploading file.', "bottom", 3000, true, "Ok", true);
    });

    this.fileTransfer.onProgress(progressEvent =>{

      if (progressEvent.lengthComputable) {
        console.log("Progress : " + Math.floor(progressEvent.loaded / progressEvent.total * 100));
      }
    });
  }

  openImageView() {
    if (this.imagePath != null && this.imagePath != "") {
     this.photoViewer.show(this.imagePath);
    }
  }

}
