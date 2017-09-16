import { Injectable } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

declare var cordova: any;

@Injectable()
export class AppConfig {
  public emailPattern = /^[_A-Za-z0-9/.]+([_A-Za-z0-9-/+/-/?/*/=///^/!/#/$/%/'/`/{/}/|/~/;]+)*@[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*(\.[A-Za-z]{2,})$/;
  // public emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.([a-zA-Z]{3,5}|[a-zA-z]{2,5}\.[a-zA-Z]{2,5})$/;


  // App Components
  public mLoader: any;
  public mToast: any;

  // App User Data
  public mUserData: any;
  public mUserName: string = "";
  public mUserNameChar: string = "";
  public mUserEmail: string = "";
  public mToken: string = "";
  public mUserType: string = "";
  public isUserLoggedIn: boolean = false;
  public isPushRegistered: boolean = false;
  public isCompareDate: boolean = false;

  constructor(
    public device: Device,
    public platform: Platform,
    public network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private toast: Toast,
    private menuCtrl: MenuController,
    public appVersion: AppVersion) {

  }

  isRunOnMobileDevice() {
    return this.platform.is('mobile') ? true : false;
  }

  isRunOnAndroidDevice() {
    return this.platform.is('android') ? true : false;
  }

  isRunOnIos() {
    return this.platform.is('ios') ? true : false;
  }

  menuSwipeEnable(enable) {
    this.menuCtrl.swipeEnable(enable);
  }

  exitApp() {
    if (this.isRunOnMobileDevice()) {
      this.platform.exitApp();
    }
  }

  getDeviceUUID() {
    if (this.isRunOnMobileDevice()) {
      return this.device.uuid;
    }

    return "";
  }

  getAppVersion() {
    return new Promise((resolve, reject) => {
      if (this.isRunOnMobileDevice()) {
        this.appVersion.getVersionNumber().then(version => {
          resolve(version);
        });
      } else {
        resolve(null);
      }
    });
  }

  getFormattedArray(object: any) {
    let mDropdown = [];

    Object.keys(object).forEach(function(e) {
      mDropdown.push({ "key": e, "value": object[e] })
    });

    return mDropdown;
  }

  getItemFromDDArray(object, key) {
    let item: any = null;

    if (object != null && object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].key == key) {
          item = object[i];
          break;
        }
      }
    }

    return item;
  }

  openNativeSetting(settingName) {
    if (typeof cordova.plugins.settings.openSetting != undefined) {
      cordova.plugins.settings.open(settingName, function(data) {
        // console.log(data);
      }, function(err) {
        // console.log(err);
      });
    } else {
      // console.log("failed to open settings.");
    }

  }

  showLoading(message) {
    this.mLoader = this.loadingCtrl.create({
      duration: 30000,
      content: message
      // spinner: 'hide',
      // showBackdrop: true,
      // enableBackdropDismiss: true,
      // dismissOnPageChange: true
    });

    if (this.mLoader != null) {
      this.mLoader.onDidDismiss(() => {
        // console.log('Dismissed loading');
      });

      this.mLoader.present();
    }
  }

  hideLoading() {
    if (this.mLoader != null) {
      this.mLoader.dismiss();
    }
  }

  // Local Toast
  showToast(msg, position, duration, isShowCloseBtn, closeButtonText, hideOnPageChange) {
    if (isShowCloseBtn) {
      this.mToast = this.toastCtrl.create({
        message: msg,
        position: position,
        duration: duration,
        showCloseButton: isShowCloseBtn,
        closeButtonText: closeButtonText,
        dismissOnPageChange: hideOnPageChange
      });
    } else {
      this.mToast = this.toastCtrl.create({
        message: msg,
        position: position,
        duration: duration,
        dismissOnPageChange: hideOnPageChange
      });
    }

    this.mToast.present();
  }

  hideToast() {
    if (this.mToast != null) {
      this.mToast.dismiss();
    }
  }

  showNativeToast(msg, position, duration) {
    if (this.isRunOnMobileDevice()) {
      this.toast.show(msg, duration, position).subscribe(
        toast => {
          console.log(toast);
        });
    } else {
      this.showToast(msg, position, duration, true, "ok", true);
    }
  }

  hideNativeToast() {
    // To-do
  }

  showAlertMsg(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });

    alert.present();
  }

  hasConnection() {
    if (this.isRunOnMobileDevice()) {
      console.log(this.network.type);

      if (this.network.type == "unknown" || this.network.type == null || this.network.type == "none") {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  setDataInStorage(key, value) {
    return new Promise(resolve => {
      this.storage.set(key, value).then(success => {
        if (success) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  getDataFromStorage(key) {
    return new Promise(resolve => {
      this.storage.get(key).then((value) => {
        if (value != null) {
          resolve(value);
        } else {
          resolve(false);
        }
      });
    });
  }

  clearStorageByKey(key) {
    return new Promise(resolve => {
      this.storage.remove(key).then((value) => {
        if (value != null) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  clearLocalStorage() {
    this.storage.clear();
  }

  validateEmail(email) {
    if (this.emailPattern.test(email)) {
      return true;
    } else {
      return false;
    }
  }


  // set user data
  setUserdata() {
    this.getDataFromStorage("userData").then(value => {
      if (value != null) {
        this.mUserData = value;
        this.mUserName = value['user'].first_name + " " + value['user'].last_name;
        this.mUserNameChar = this.mUserName.substr(0, 1);
        this.mUserEmail = value['user'].email;
        this.mToken = value['user'].api_token;
        this.mUserType = value['user'].roles[0].type;
        this.isUserLoggedIn = true;
      } else {
        this.mUserData = null;
        this.mUserName = "";
        this.mUserEmail = "";
        this.mUserNameChar = "";
        this.mToken = "";
        this.mUserType = "";
        this.isUserLoggedIn = false;
        this.isPushRegistered = false;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  clearUserData() {
    this.mUserData = null;
    this.mUserName = "";
    this.mUserEmail = "";
    this.mUserNameChar = "";
    this.mUserType = "";
    this.mToken = "";
    this.isPushRegistered = false;

    this.clearLocalStorage();
  }


  dateCompare(comparedate){
    var cdate = new Date();
    var cday= cdate.getDate();
    var cmonth= cdate.getMonth()+1;
    var cyear= cdate.getFullYear();
    var arrayvar= comparedate.split("-");
    //console.log(arrayvar[0]+" "+ arrayvar[1]+" "+arrayvar[2]);

    var  date1 = new Date(cyear,cmonth,cday);
    var  date2 = new Date(+arrayvar[2],+arrayvar[1],+arrayvar[0]);
    if(date2  > date1 )
    {
      this.isCompareDate = false;
  //    console.log("Date2 is after than date1");
    }
    else if(date2  < date1 )
    {
    this.isCompareDate = true;
//      console.log("Date2 is before than Date1");
    }
    else if(date2.getTime() === date1.getTime() )
    {
      this.isCompareDate = false;
    //  console.log("Both equal");
    }
    return this.isCompareDate;
  }
  //get first latter from text

  getfirstLatter(text) {
    if (text == null) {
      return "";
    } else {
      return text.substr(0, 1);
    }
  }

  // Transform date - return dd-MM-yyyy
  transformDate(date) {
    let mStrDate: string = "";

    if (date != null && date != "") {
      var dateObj = new Date(date);

      if (dateObj != null && isNaN(dateObj.getTime()) == false) {
        if (dateObj.getTime() != null) {
          let mMonth: string = (dateObj.getMonth() + 1).toString();
          let mDate: string = dateObj.getDate().toString();
          let mYear: string = dateObj.getFullYear().toString();

          if (mDate.length == 1) {
            mDate = "0" + dateObj.getDate();
          }

          if (mMonth.length == 1) {
            mMonth = "0" + (dateObj.getMonth() + 1);
          }

          mStrDate = mDate + "-" + mMonth + "-" + mYear;
        }
      }
    }

    return mStrDate;
    // return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  dmyToYmd(date) {
    if (date != null && date != "") {
      var dateObj = new Date(date);
      if (dateObj.getTime() != null) {
        return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
      } else {
        return "";
      }
    }
    return "";
    //return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need.
  }

  // formate
  stringToDateToISO(date) {
    if (date != null && date != "") {
      var dateObj = date.split('-');
      var dateObjs = new Date(dateObj[2] + "-" + dateObj[1] + "-" + dateObj[0]);
      return dateObjs.toISOString();
    }
    return "";
  }

  compareTwoDate(date1, date2) {
    var firstDate = new Date(date1);
    var secondDate = new Date();

    if (date2 != null && date2 != "") {
      var dateObj2 = date2.split('-');
      secondDate = new Date(dateObj2[2], dateObj2[1], dateObj2[0]);
    }

    if (firstDate <= secondDate) {
      return true;
    }

    return false;
  }


  /*
  *  get display api errors
  */
  displayApiErrors(error) {
    let msg: any = [];

    Object.keys(error).forEach((item) => {
      msg += error[item] + "<br />";
    });

    this.showAlertMsg("Error", msg);
  }

}

export class AppMsgConfig {
  // String Messages
  public Loading = "Loading...";
  public Error = "Error";
  public NetworkErrorMsg = "Network Error.";
  public InternetConnection = "Internet Connection";
  public NoInternetMsg = "No internet connection available.";
  public NoTextMsg = "No data available.";
  public NoMoreDataMsg = "No more data available.";

  public Yes = "Yes";
  public No = "No"

  public EmailRequiredMsg = "Enter email id";
  public EmailValidMsg = "Please enter valid email id";
  public PassowordRequiredMsg = "Enter password";
  public CitiesRequired = "Please select city.";
  public SteteRequired = "Please select state.";
  public MobileRequired = "Enter mobile no.";
  public MobileDigitLimit = "Mobile no must be 10 digit.";
  public MobileDigitNumeric = "Mobile no must be numeric.";

  // Login page
  public LoginSuccessMsg = "Login successfully.";
  public LogoutSuccessMsg = "Logout successfully.";

  constructor() {

  }
}
