import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AppConfig } from '../../providers/AppConfig';
import * as firebase from 'firebase';

@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html',
})
export class UploadImagePage {
  public imagePath: string = "";
  public imageName: string = "";
  public showUpload: boolean = false;
  public showdownloadBtn: boolean = false;
  public fileTransfer: FileTransferObject = this.transfer.create();
  public userProfileRef: firebase.database.Reference;
  public imageList: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public camera: Camera,
    public transfer: FileTransfer,
    public file: File,
    public photoViewer: PhotoViewer,
    public filePath: FilePath,
    public appConfig: AppConfig) {
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
          this.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.DestinationType.DATA_URL);
        }
      }, {
          text: 'Use Camera',
          handler: () => {
            this.captureImage(this.camera.PictureSourceType.CAMERA, this.camera.DestinationType.DATA_URL);
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
          this.showUpload = true;
        } else if (destinationType == this.camera.DestinationType.FILE_URI) {

          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(resultData)
              .then(filePath => {
                // Create a timestamp as filename
              //  let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
                //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

              });
          } else {
            // var correctPath = resultData.substr(0, resultData.lastIndexOf('/') + 1);
            //var currentName = resultData.substr(resultData.lastIndexOf('/') + 1);
            //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

          }
        }
      }, (err) => {

        this.appConfig.showToast(err, "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast("Camera plugin does not work in browser.", "bottom", 3000, true, "Ok", true);
    }
  }

  public createFileName() {
    return "img_" + new Date().getTime() + ".jpg";
  }

  public uploadImageWithFirebase() {
    let loader = this.loadingCtrl.create({
      content: "Uploading Image, Please Wait...",
    });
    loader.present();
    let storageRef = firebase.storage().ref();
    let databaseRef = firebase.database().ref();
    try {
      const filename = "img_" + Math.floor(Date.now() / 1000);

      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`images/${filename}.jpg`);
      imageRef.putString(this.imagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {

        databaseRef.child('image').push({
          imageUrl: snapshot.downloadURL,

        }).then(() => {
          loader.dismiss();
          this.imagePath = "assets/img/img-icon.png";
          this.imageName = "img-icon.png";
          this.showUpload = false;
          this.appConfig.showToast("File Uploaded to firebase", "bottom", 3000, true, "Ok", true);
        }).catch((e) => {
          loader.dismiss();
          this.appConfig.showToast("File not uploaded to firebase", "bottom", 3000, true, "Ok", true);
        })
      });
    } catch (e) {
      loader.dismiss();
      this.appConfig.showToast("File not uploaded to firebase", "bottom", 3000, true, "Ok", true);
    }
  }

  openImageView() {
    if (this.imagePath != null && this.imagePath != "") {
      this.photoViewer.show(this.imagePath);
    }
  }

}
