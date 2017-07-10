import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientContactService} from '../../../providers/contact/contact-service';
import { ClientContactPage } from '../list/contact';


@Component({
  selector: 'page-contact-add',
  templateUrl: 'contact-add.html'
})

export class ClientContactAddPage {
  @ViewChild('txtGroupName') mEditTextGroupName;
  public mRefresher: any;
  public contactType: string = "client";
  public apiResult: any;
  public name: string = "";
  public designation: string="";
  public mobile_no: string="";
  public email: string="";
  public address: string="";
  public city: string="";
  public mAlertBox: any;
  public api_token = this.appConfig.mToken;
  public mClientContactDD: any = [];
  public select_client: string = "";

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,

    public clientContactService: ClientContactService
  ) {
    this.getClientContactDropDownData(true);
  }

  setFocus(object: any) {
    setTimeout(() => {
      object.setFocus();
    }, 500);
  }
  doChangeListType() {
    // console.log("List Type : " + this.taskListType);

    // this.manageHideShowBtn();
  }

onClientChange(){
  console.log(this.select_client);
}
  getClientContactDropDownData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.user.api_token;

      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.clientContactService.getClientContactDropDown(token).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          if (this.apiResult.success) {
            this.setClientContactDD(this.apiResult);
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
    //  this.manageNoData();
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }
  setClientContactDD(data) {
     console.log(data);

     if (data.clients != null) {
       let mClientContactDD = [];

       Object.keys(data.clients).forEach(function(key) {
         mClientContactDD.push({'key': key, 'value': data.clients[key]});
       });

       this.mClientContactDD = mClientContactDD;
     }
  }
  showInValidateErrorMsg(message) {
    this.mAlertBox = this.alertCtrl.create({
      title: "",
      subTitle: message,
      buttons: ['Ok']
    });

    this.mAlertBox.present();
  }

  onClickAddClientContact() {
    let isValid = true;

    if (!this.validateName()) {
      this.showInValidateErrorMsg("Enter name.");
      isValid = false;
    }
    else if (!this.validateDesignation()) {
      this.showInValidateErrorMsg("Enter designation.");
      isValid = false;
    }
    else if (!this.validateMobileNo()) {
      this.showInValidateErrorMsg("Enter mobile no.");
      isValid = false;
    }
    else if (!this.validateEmail()) {
      this.showInValidateErrorMsg("Enter email id.");
      isValid = false;
    }
    else if (!this.validateAddress()) {
      this.showInValidateErrorMsg("Enter address.");
      isValid = false;
    }
    else if (!this.validateCity()) {
      this.showInValidateErrorMsg("Enter city.");
      isValid = false;
    }
    else   {
      this.showInValidateErrorMsg("All set.");
      //this.addClientGroup();
    }
  }

  validateName() {
    let isValid = true;

    if (this.name == null || (this.name != null && this.name.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateDesignation() {
    let isValid = true;

    if (this.designation == null || (this.designation != null && this.designation.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateMobileNo() {
    let isValid = true;

    if (this.mobile_no == null || (this.mobile_no != null && this.mobile_no.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateEmail() {
    let isValid = true;

    if (this.email == null || (this.email != null && this.email.trim() == "")) {
      isValid = false;
    }else if (!this.appConfig.validateEmail(this.email)) {
    //  this.appConfig.showNativeToast(this.appMsgConfig.EmailValidMsg, "bottom", 3000);
      isValid= false;
    }
    else{
      isValid=true;
    }

    return isValid;
  }

  validateAddress() {
    let isValid = true;

    if (this.address == null || (this.address != null && this.address.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateCity() {
    let isValid = true;

    if (this.city == null || (this.city != null && this.city.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  // addClientGroup() {
  //   if (this.appConfig.hasConnection()) {
  //     this.appConfig.showLoading(this.appMsgConfig.Loading);
  //
  //     let post_param = {
  //       "api_token": this.api_token,
  //       "name": this.name.trim()
  //     };
  //
  //     this.clientContactService.addClientGroup(post_param).then(data => {
  //       if (data != null) {
  //         this.apiResult = data;
  //         // console.log(this.apiResult);
  //
  //         if (this.apiResult.success) {
  //           this.appConfig.showNativeToast(this.appMsgConfig.ClientGroupAddSuccess, "bottom", 3000);
  //
  //           setTimeout(() => {
  //             this.navCtrl.setRoot(ClientContactPage);
  //           }, 500);
  //         } else {
  //           if (this.apiResult.error != null && this.apiResult.error != "") {
  //             this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
  //           } else if (this.apiResult.name != null && this.apiResult.name.length > 0) {
  //             this.appConfig.showAlertMsg("", this.apiResult.name[0]);
  //           } else {
  //             this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
  //           }
  //         }
  //       } else {
  //         this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
  //       }
  //
  //       this.appConfig.hideLoading();
  //     }, error => {
  //       this.appConfig.hideLoading();
  //       this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
  //     });
  //   } else {
  //     this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
  //   }
  // }

}
