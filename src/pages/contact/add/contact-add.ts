import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams} from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientContactService} from '../../../providers/contact/contact-service';

@Component({
  selector: 'page-contact-add',
  templateUrl: 'contact-add.html'
})

export class ClientContactAddPage {
  @ViewChild('txtGroupName') mEditTextGroupName;
  public mRefresher: any;

  public apiResult: any;

  public mAlertBox: any;
  public api_token = this.appConfig.mToken;
  public mClientContactDD: any = [];

  public mClientContactCityDD: any = [];

  public client: any = {
    type: "client",
    client_id: "",
    name: "",
    designation: "",
    mobile_no: "",
    email: "",
    address: "",
    city_id: "",
    api_token: this.api_token
  };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public navParams: NavParams,
    public clientContactService: ClientContactService
  ) {
    if (this.navParams.get('client_id') != null) {
      this.client.client_id = this.navParams.get('client_id');
    }
    this.getClientContactDropDownData(true);
  }

  setFocus(object: any) {
    setTimeout(() => {
      object.setFocus();
    }, 500);
  }

  onClientChange() {
    //console.log(this.client.type);
  }
  onClientCityChange() {
    //console.log(this.client.city_id);
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
    //  console.log(data);

    if (data.clients != null) {
      let mClientContactDD = [];

      Object.keys(data.clients).forEach(function(key) {
        mClientContactDD.push({ 'key': key, 'value': data.clients[key] });
      });

      this.mClientContactDD = mClientContactDD;
    }
    if (data.cities != null) {
      let mClientContactCityDD = [];

      Object.keys(data.cities).forEach(function(key) {
        mClientContactCityDD.push({ 'key': key, 'value': data.cities[key] });
      });

      this.mClientContactCityDD = mClientContactCityDD;
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
    if (!this.validateClientType()) {
      this.showInValidateErrorMsg("Select client.");
      isValid = false;
    }
    else if (!this.validateName()) {
      this.showInValidateErrorMsg("Enter name.");
      isValid = false;
    }

    else if (!this.validateMobileNo()) {
      isValid = false;
    }

    else if (!this.validateEmail()) {
      isValid = false;
    }
    // else if (!this.validateDesignation()) {
    //   this.showInValidateErrorMsg("Enter designation.");
    //   isValid = false;
    // }
    //
    // else if (!this.validateEmail()) {
    //   this.showInValidateErrorMsg("Enter email id.");
    //   isValid = false;
    // }
    // else if (!this.validateAddress()) {
    //   this.showInValidateErrorMsg("Enter address.");
    //   isValid = false;
    // }
    else if (!this.validateCity()) {
      this.showInValidateErrorMsg("Select city.");
      isValid = false;
    }
    else {

      this.addClientContact();
    }
  }
  validateClientType() {
    let isValid = true;

    if (this.client.type == 'client') {
      if (this.client.client_id == "") {
        isValid = false;
      }
    }
    else {
      this.client.client_id = 0;
      isValid = true;
    }

    return isValid;
  }
  validateName() {
    let isValid = true;

    if (this.client.name == null || (this.client.name != null && this.client.name.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateDesignation() {
    let isValid = true;

    if (this.client.designation == null || (this.client.designation != null && this.client.designation.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateMobileNo() {
    let isValid = true;
    if (this.client.mobile_no.length > 0) {
      if (this.client.mobile_no == null || (this.client.mobile_no != null && this.client.mobile_no.trim() == "")) {
        isValid = false;
        this.showInValidateErrorMsg("Enter mobile no.");
      }
      else if (this.client.mobile_no.trim().length < 10 || this.client.mobile_no.trim().length > 10) {

        isValid = false;
        this.showInValidateErrorMsg("Enter mobile no. must be 10 digit");
      }
    }


    return isValid;
  }

  validateEmail() {
    let isValid = true;
    if (this.client.email.length > 0) {
      if (this.client.email == null || (this.client.email != null && this.client.email.trim() == "")) {
        isValid = false;
        this.showInValidateErrorMsg("Enter email id.");
      } else if (!this.appConfig.validateEmail(this.client.email)) {
        isValid = false;
        this.showInValidateErrorMsg("Please enter valid email.");
      }
      else {
        isValid = true;
      }
    }


    return isValid;
  }

  validateAddress() {
    let isValid = true;

    if (this.client.address == null || (this.client.address != null && this.client.address.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  validateCity() {
    let isValid = true;

    if (this.client.city_id == null || (this.client.city_id != null && this.client.city_id.trim() == "")) {
      isValid = false;
    }

    return isValid;
  }

  addClientContact() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientContactService.addClientContact(this.client).then(data => {
        if (data != null) {
          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.ClientContactAddSuccess, "bottom", 3000);

            setTimeout(() => {
              this.navCtrl.pop();
            }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else if (this.apiResult.name != null && this.apiResult.name.length > 0) {
              this.appConfig.showAlertMsg("", this.apiResult.name[0]);
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

}
