import { Injectable } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
declare var cordova: any;

@Injectable()
export class AppConfig {
  // App Url's
  public API_URL: string = "http://dev.onzup.com/api/";
  public emailPattern = /^[_A-Za-z0-9/.]+([_A-Za-z0-9-/+/-/?/*/=///^/!/#/$/%/'/`/{/}/|/~/;]+)*@[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*(\.[A-Za-z]{2,})$/;

  // App Components
  public mLoader;
  public mToast;

  // App User Data
  public mUserData: any;
  public mUserName: string = "";
  public mUserNameChar: string = "";
  public mUserEmail: string = "";
  public mToken: string = "";
  public mUserType: string = "";

  public userPermission: any = {};
  public clientPermission: any = {};
  public companyPermisison: any = {};

  public clientAccountId: string = "";

  constructor(
    public platform: Platform,
    public network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private toast: Toast,
    private menuCtrl: MenuController,
    private datePipe: DatePipe) {
    //  this.setUserPermissions();
    //  this.setUserdata();
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

  exitApp() {
    this.platform.exitApp();
  }

  menuSwipeEnableFalse() {
    this.menuCtrl.swipeEnable(false);
  }

  openNativeSetting(settingName) {
    this.platform.ready().then(() => {
      cordova.plugins.settings.open(settingName, function(err)
      { console.log("opened nfc settings") },
        function(err) {
          console.log("failed to open nfc settings")
        });
    });
  }

  showLoading(message) {
    this.mLoader = this.loadingCtrl.create({
      content: message
      // spinner: 'hide',
      // duration: 3000,
      // showBackdrop: true,
      // enableBackdropDismiss: true,
      // dismissOnPageChange: true
    });

    this.mLoader.onDidDismiss(() => {
      // console.log('Dismissed loading');
    });

    this.mLoader.present();
  }

  hideLoading() {
    this.mLoader.dismiss();
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
      if (this.network.type == "unknown" || this.network.type == "none") {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  checkLogin() {
    return new Promise(resolve => {
      this.storage.get("userData").then((val) => {
        if (val != null) {
          resolve(val);
        } else {
          resolve(false);
        }
      });
    });
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

  setUserPermissions() {
    return new Promise(resolve => {
      this.storage.get('userData').then((val) => {
        if (val != null) {
          if (val.user != null && val.user.roles[0]) {
            if (val.user.roles[0].permissions != null && Object.keys(val.user.roles[0].permissions).length > 0) {
              this.userPermission = val.user.roles[0].permissions;
              // console.log(this.userPermission);
            }

            if (val.user.roles[0].client_permissions != null && Object.keys(val.user.roles[0].client_permissions).length > 0) {
              this.clientPermission = val.user.roles[0].client_permissions;
              // console.log(this.clientPermission);
            }

            resolve(true);
          }
        } else {
          resolve(false);
        }
      });
    });
  }

  // Get user all permission by name
  getUserPermissionByName(permissionName) {
    if (permissionName != null && permissionName != "") {
      if (this.userPermission != null && Object.keys(this.userPermission).length > 0) {
        if (this.userPermission[permissionName] != null && this.userPermission[permissionName]) {
          for (let i = 0; i < Object.keys(this.userPermission[permissionName]).length; i++) {
            // console.log(this.userPermission[permissionName][i]);
          }
        }
      }
    }
  }

  // Check for User has permission by name
  hasUserPermissionByName(permissionName, permissionType) {
    if (permissionName != null && permissionName != "" && permissionType != null && permissionType != "") {
      if (this.userPermission != null && Object.keys(this.userPermission).length > 0) {
        if (this.userPermission[permissionName] != null && this.userPermission[permissionName] && Object.keys(this.userPermission[permissionName]).length > 0) {
          for (let i = 0; i < Object.keys(this.userPermission[permissionName]).length; i++) {
            // console.log(this.userPermission[permissionName][i].permission_name + " : " + this.userPermission[permissionName][i].permission_value);

            if (this.userPermission[permissionName][i].permission_name == permissionName + "." + permissionType) {
              return this.userPermission[permissionName][i].permission_value;
            }
          }
        } else {
          return false;
        }
      }
    }
  }

  // Check for client  has permission
  hasClientPermissionByName(permissionName) {
    if (permissionName != null && permissionName != "") {
      if (this.clientPermission != null && Object.keys(this.clientPermission).length > 0) {
        for (let i = 0; i < Object.keys(this.clientPermission).length; i++) {
          // console.log(Object.keys(this.clientPermission)[i] + " : " + this.clientPermission[permissionName]);

          if (Object.keys(this.clientPermission)[i] == permissionName) {
            return this.clientPermission[permissionName];
          }
        }
      } else {
        return "no";
      }
    }
  }

  // set company permission

  setCompanyPermissions() {
    return new Promise(resolve => {
      this.storage.get('companyPermisison').then((val) => {
        if (val != null && Object.keys(val).length > 0) {
          if (val.data != null) {
            this.companyPermisison = val.data[0];
            //console.log(this.companyPermisison);
            resolve(true);
          }
        } else {
          resolve(true);
        }
      });
    });
  }

  // check is company selected
  checkIsCompanySelected() {
    return new Promise(resolve => {
      this.getDataFromStorage("isCompany").then((val) => {
        if (val != null && val) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, err => {
        resolve(false);
      });
    });
  }

  // Check User Type Is client Or is User
  checkUserType() {
    return new Promise(resolve => {
      this.storage.get('userData').then((val) => {
        if (val != null) {
          if (val.user != null && val.user.roles[0]) {
            if (val.user.roles[0].type == "client") {
              resolve("client");
            } else {
              resolve("administrator");
            }
          }
        } else {
          resolve(false);
        }
      });
    });
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
      } else {
        this.mUserData = null;
        this.mUserName = "";
        this.mUserEmail = "";
        this.mUserNameChar = "";
        this.mToken = "";
        this.mUserType = "";
      }
    }).catch(err => {
      console.log(err);
    });
  }

  clearUserData() {
    this.userPermission = null;
    this.clientPermission = null;
    this.companyPermisison = null;

    this.mUserData = null;
    this.mUserName = "";
    this.mUserEmail = "";
    this.mUserNameChar = "";
    this.mUserType = "";
    this.mToken = "";
    this.clientAccountId = "";

    this.clearLocalStorage();
  }

  //get first latter from text

  getfirstLatter(text) {
    if (text == null) {
      return "";
    } else {
      return text.substr(0, 1);
    }
  }

  // Transfor date
  // param date
  //return dd-MM-yyyy

  transformDate(date) {
    return this.datePipe.transform(date, 'dd-MM-yyyy'); //whatever format you need.
  }

  dmyToYmd(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need.
  }

  // formate
  stringToDateToISO(date){
    if(date != null && date != ""){
      var dateObj = date.split('-');
      return new Date(dateObj[2]+"-" + (dateObj[1]-1) +"-" + dateObj[0]).toISOString();
    }
    return "";
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
  public MobileDigitLimit = "Enter mobile no must be 10 digit.";
  public MobileDigitNumeric = "Enter mobile no must be numeric.";

  // Login page
  public LoginSuccessMsg = "Login successfully.";
  public LogoutSuccessMsg = "Logout successfully.";

  // Task page
  public Task = "TASK";
  public TaskDeleteConfirm = "Are you sure you want to delete this task?";
  public TaskDeleteSuccess = "Task deleted successfully.";
  public TaskAssigneeChangeSuccess = "Assign task";
  public TaskAddSuccess = "Task added successfully.";
  public TaskEditSuccess = "Task edited successfully.";
  public TaskReopenConfirm = "Are you sure you want to reopen this task?";
  public TaskReopenSuccess = "Task reopen successfully.";


  public Client = "CLIENT";
  public ClientAddSuccess = "Client added successfully.";
  public ClientEditSuccess = "Client edited successfully.";
  public ClientDeleteSuccess = "Client deleted successfully.";
  public ClientDeleteConfirm = "Are you sure you want to delete this client?";

  public ClientGroup = "CLIENT GROUP";
  public ClientGroupAddSuccess = "Group added successfully.";
  public ClientGroupEditSuccess = "Group edited successfully.";
  public ClientGroupDeleteSuccess = "Group deleted successfully.";
  public ClientGroupDeleteConfirm = "Are you sure you want to delete this group?";


  public ClientContact = "CLIENT CONTACT";
  public ClientContactAddSuccess = "Contact added successfully.";
  public ClientContactEditSuccess = "Contact edited successfully.";
  public ClientContactDeleteSuccess = "Contact deleted successfully.";
  public ClientContactDeleteConfirm = "Are you sure you want to delete this contact?";

  public Employees = "EMPLOYEES";
  public EmployeesAddSuccess = "Employee added successfully.";
  public EmployeesEditSuccess = "Employee edited successfully.";
  public EmployeesDeleteSuccess = "Employee deleted successfully.";
  public EmployeesDeleteConfirm = "Are you sure you want to delete this employee?";
  public EmployeesPasswordSuccess = "Password generated successfully.";

  public EmployeeDepartmentRequired = "Please select employee department.";
  public EmployeeRoleRequired = "Please select employee role.";
  public EmployeeBloodGroup = "Please select blood group.";
  public EmployeeLeaveType = "Please select leave type.";
  public EmployeePhone = "Enter phone no.";
  public EmployeePhoneNumeric = "Enter phone no must be numeric.";
  public EmployeeSalary = "Enter salary.";


  constructor() {

  }
}
