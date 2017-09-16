import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { DashboardService } from '../../providers/dashboard/dashboard-service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import * as firebase from 'firebase';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {
  public mRefresher: any;
  public mInfiniteScroll: any;

  public apiResult: any;
  public mImageListData: any = [];

  public view: string = "list";
  public rows: any = [];
  public totalLength = 100;
  public page: number = 1;

  public showNoData: boolean = false;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public photoViewer: PhotoViewer,
    public dashboardService: DashboardService,
    public modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.refreshData();
    this.getImageListFromFirebase(true);
  }

  ionViewWillLeave() {

  }

  changeView(view) {
    this.view = view;
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getImageListFromFirebase(true);
  }

  refreshData() {
    this.mImageListData = [];
    this.page = 1;
    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    this.mInfiniteScroll.complete();
    this.mInfiniteScroll.enable(false);

    //this.appConfig.showToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000, true, "Ok", true);
  }

  async getDataFromFirebase(): Promise<any> {
    var imageData = [];
    let databaseRef = firebase.database().ref("image");
    let showMessage = this.appConfig;
    var postListPromise = new Promise(function(resolve, reject) {
      databaseRef.orderByKey().on("child_added", function(snapshot, prevChildKey) {
        var imagesUrls = snapshot.val();
        imageData.push({ link: imagesUrls.imageUrl });
        // Get Number of record from firebase
        if (imageData.length === snapshot.numChildren()) {
          resolve(imageData);
        }
      }, function(errorObject) {
        showMessage.showToast(errorObject.code, "bottom", 3000, true, "Ok", true);
      });
    })
    return postListPromise;
  }

  async getImageListFromFirebase(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.setImageData(await this.getDataFromFirebase());

      if (showLoader) {
        this.appConfig.hideLoading();
      }
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setImageData(data) {
    if(data != null && data.length > 0){
      this.showNoData = false;
      this.mImageListData = data;
      this.rows = Array.from(Array(Math.ceil(this.mImageListData.length / 2)).keys());
    }else {
      this.mImageListData = [];
      this.showNoData = true;
    }

  }

  openImageView(item) {
    if (this.appConfig.hasConnection()) {
      if (item.link != null && item.link != "") {
        this.photoViewer.show(item.link);
      }
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }
}
