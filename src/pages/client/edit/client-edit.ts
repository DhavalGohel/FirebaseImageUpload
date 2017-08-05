import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientService } from '../../../providers/client/client-service';
import { ClientListPage } from '../list/client';

@Component({
  selector: 'page-client-edit',
  templateUrl: 'client-edit.html'
})

export class ClientEditPage {
  public apiResult: any;
  public apiCitiesResilt: any;
  public api_token = this.appConfig.mToken;
  public clientId: string = null;

  public tab: string = 'basic_info';
  public searchService: string = "";
  public mSearchTimer: any;

  public client: any = {};
  public mClientContactCityDD: any = [];
  public mClientData: any = [];

  public servicesData: any = [];
  public mUserServiceData: any = [];
  public mTempServiceData: any = [];
  public mTempCheckedArrayList: any = [];

  public mClientTypeDD: any = [];
  public mClientGroupDD: any = [];
  public mClientOpeningTypeDD: any = [];
  public mClientGroupBillingDD: any = [];
  public mOtherClientsDD: any = [];

  public mClientCountryDD: any = [];
  public mClientStateDD: any = [];
  public mClientCitiesDD: any = [];
  public isCities: boolean = false;
  public isStates: boolean = false;
  public isCallCityDD = true;

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientService: ClientService,
    public eventsCtrl: Events) {
    if (this.navParam.get('item_id')) {
      this.clientId = this.navParam.get('item_id');
      this.onLoadGetClientData();
    } else {
      this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      this.navCtrl.pop();
    }
  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe("search-select:refresh_value", (data) => {
      this.onSearchSelectChangeValue(data);
    });
  }

  ionViewDidLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.tab = tabName;
    }, 500);
  }

  onSearchBlurEvent() {
    if (this.searchService != null && this.searchService.trim().length >= 0) {
      this.searchData();
    }
  }

  searchData() {
    if (this.mSearchTimer != null) {
      clearTimeout(this.mSearchTimer);
    }

    if (this.searchService != null && this.searchService.trim().length >= 0) {
      this.mSearchTimer = setTimeout(() => {
        this.mTempServiceData = this.mUserServiceData.filter((item) => {
          return (item.name.toLowerCase().indexOf(this.searchService.toLowerCase()) > -1);
        });

        let checkedArray = [];
        this.mUserServiceData.forEach(function(item) {
          if (item.status) {
            checkedArray.push(item);
          }
        });
        this.mTempCheckedArrayList = checkedArray;
      }, 300);

    } else {
      this.mTempServiceData = this.mUserServiceData;
    }
  }

  onLoadGetClientData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientService.getClientEditData(this.clientId, this.api_token).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setClientData(this.apiResult);
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
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  isValueInDDArray(object, key) {
    let isAvailable = false;

    if (object != null && object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].key == key) {
          isAvailable = true;
          break;
        }
      }
    }

    return isAvailable;
  }

  setClientData(data) {
    this.client = data.client;
    this.client.create_login = (data.client.create_login != null && data.client.create_login == "yes") ? true : false;
    this.client.is_active = (data.client.is_active != null && data.client.is_active == "yes") ? true : false;
    this.client.notify_via_sms = (data.client.notify_via_sms != null && data.client.notify_via_sms == "yes") ? true : false;
    this.client.notify_via_email = (data.client.notify_via_email != null && data.client.notify_via_email == "yes") ? true : false;

    this.client.opening_balance = (data.client.opening_balance != null && data.client.opening_balance != "") ? data.client.opening_balance : "";
    this.client.opening_balance_type = (data.client.opening_balance_type != null && data.client.opening_balance_type != "") ? data.client.opening_balance_type : "";
    this.client.group_billing = (data.client.group_billing != null && data.client.group_billing != "") ? data.client.group_billing : "";
    this.client.other_client_id = (data.client.other_client_id != null && data.client.other_client_id != "") ? data.client.other_client_id : "";

    this.servicesData = data.services;
    this.mClientData = data.client_data;

    this.setClientAllDDData(data);
    this.setServiceData();

    if (data.client.create_login != null && data.client.create_login != "") {
      this.client.create_login = true;
    } else {
      this.client.create_login = false;
    }

    if (data.client.country_id != null && data.client.country_id != "") {
      if (this.isValueInDDArray(this.mClientCountryDD, data.client.country_id)) {
        this.client.country_id = data.client.country_id;

        if (data.client.state_id != null && data.client.state_id != "") {
          if (this.isValueInDDArray(this.mClientStateDD, data.client.state_id)) {
            this.client.state_id = data.client.state_id;
          } else {
            this.client.state_id = "";
          }
        }

        if (data.client.city_id != null && data.client.city_id != "") {
          if (this.isValueInDDArray(this.mClientCitiesDD, data.client.city_id)) {
            this.client.city_id = data.client.city_id;
          } else {
            this.client.city_id = "";
          }
        }

      } else {
        this.client.country_id = "";
        this.client.state_id = "";
        this.client.city_id = "";
      }
    } else {
      this.client.country_id = "";
      this.client.state_id = "";
      this.client.city_id = "";
    }
  }

  setClientAllDDData(data) {
    if (data != null && Object.keys(data).length > 0) {
      if (data.client_types != null) {
        this.mClientTypeDD = this.getFormattedArray(data.client_types);
      }

      if (data.client_groups != null) {
        this.mClientGroupDD = this.getFormattedArray(data.client_groups);
      }

      if (data.states != null) {
        this.mClientStateDD = this.getFormattedArray(data.states);
      }

      if (data.countries != null) {
        this.mClientCountryDD = this.getFormattedArray(data.countries);
      }

      if (data.cities != null) {
        this.showCities(true);
        this.mClientCitiesDD = this.getFormattedArray(data.cities);
      }

      if (data.opening_type != null) {
        this.mClientOpeningTypeDD = this.getFormattedArray(data.opening_type);
      }

      if (data.group_billing != null) {
        this.mClientGroupBillingDD = this.getFormattedArray(data.group_billing);
      }

      if (data.other_client != null) {
        this.mOtherClientsDD = this.getFormattedArray(data.other_client);
      }

    } else {
      this.clearAllDD();
    }
  }

  clearAllDD() {
    this.mClientTypeDD = [];
    this.mClientGroupDD = [];
    this.mClientCountryDD = [];
    this.mClientStateDD = [];
    this.mClientCitiesDD = [];
    this.mClientOpeningTypeDD = [];
    this.mClientGroupBillingDD = [];
    this.mOtherClientsDD = [];
  }

  getFormattedArray(object: any) {
    let mDropdown = [];

    Object.keys(object).forEach(function(e) {
      mDropdown.push({ "key": e, "value": object[e] })
    });

    return mDropdown;
  }

  setServiceData() {
    if (this.servicesData != null && this.servicesData.length > 0) {
      let serviceData = [];

      this.servicesData.forEach(function(item) {
        serviceData.push({ "account_service_master_id": item.id, "amount": item.amount, "status": false, "name": item.name });
      });

      this.mUserServiceData = serviceData;
    }

    this.mTempServiceData = this.mUserServiceData;
  }

  // Get state Base On State
  onChangeGetState(module) {
    this.client.state_id = "";
    this.client.city_id = "";
    this.isCallCityDD = false;

    this.mClientStateDD = [];
    this.mClientCitiesDD = [];
    this.getStatesDD(this.client.country_id, module);
  }

  // Get City Base On State
  onChangeGetCity(module) {
    this.client.city_id = "";
    this.mClientCitiesDD = [];

    if (this.isCallCityDD) {
      this.getCitiesDD(this.client.state_id, module);
    }
  }

  getStatesDD(data, module) {
    if (this.appConfig.hasConnection()) {
      let get_param = {
        "country_id": data
      };

      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientService.getModuleDropDown(this.api_token, module, get_param).then(data => {
        this.isCallCityDD = true;

        if (data != null) {
          this.appConfig.hideLoading();

          this.apiCitiesResilt = data;

          if (this.apiCitiesResilt.success) {
            this.setStatesDD(this.apiCitiesResilt);
          } else {
            if (this.apiCitiesResilt.error != null && this.apiCitiesResilt.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiCitiesResilt.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
            this.showStates(false);
          }
        } else {
          this.showStates(false);
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.showStates(false);
        this.isCallCityDD = true;
        this.appConfig.hideLoading();
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      });
    } else {
      this.isCallCityDD = true;
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  getCitiesDD(data, module) {
    if (this.appConfig.hasConnection()) {
      let get_param = {
        "state_id": data
      };

      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientService.getModuleDropDown(this.api_token, module, get_param).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiCitiesResilt = data;

          if (this.apiCitiesResilt.success) {
            this.setCitiesDD(this.apiCitiesResilt);
          } else {
            if (this.apiCitiesResilt.error != null && this.apiCitiesResilt.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiCitiesResilt.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
            this.showCities(false);
          }
        } else {
          this.showCities(false);
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.showCities(false);
        this.appConfig.hideLoading();
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setCitiesDD(data) {
    if (data != null && Object.keys(data).length > 0) {
      this.showCities(true);
      this.mClientCitiesDD = this.getFormattedArray(data.cities);
    } else {
      this.showCities(false);
      this.mClientCitiesDD = [];
    }
  }

  showCities(value) {
    this.isCities = value;
  }

  setStatesDD(data) {
    if (data != null && Object.keys(data).length > 0) {
      this.showStates(true);
      this.mClientStateDD = this.getFormattedArray(data.states);
    } else {
      this.showStates(false);
      this.mClientStateDD = [];
    }
  }

  showStates(value) {
    this.isStates = value;
  }

  multipleError(error) {
    let msg: any = [];

    Object.keys(error).forEach((item) => {
      msg += error[item] + "<br />";
    });

    this.appConfig.showAlertMsg(this.appMsgConfig.Error, msg);
  }

  checkFirstName() {
    if (this.client.name != null && this.client.name != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter Name");
      return false;
    }
  }

  checkAddress() {
    if (this.client.address_1 != null && this.client.address_1 != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter Address");
      return false;
    }
  }

  checkState() {
    if (this.client.state_id != null && this.client.state_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.SteteRequired);
      return false;
    }
  }

  checkCities() {
    if (this.client.city_id != null && this.client.city_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.CitiesRequired);
      return false;
    }
  }

  checkClientType() {
    if (this.client.client_type) {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Select Client Type");
      return false;
    }
  }

  checkMobileNo() {
    let isValid = true;

    if (this.client.mobile == null || (this.client.mobile != null && this.client.mobile.toString().trim() == "")) {
      isValid = false;
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileRequired);
    } else if (this.client.mobile != null && this.client.mobile.toString().trim() != "") {
      if (isNaN(this.client.mobile)) {
        isValid = false;
        this.appConfig.showAlertMsg("", this.appMsgConfig.MobileDigitNumeric);
      } else if (this.client.mobile.toString().trim().length != 10) {
        isValid = false;
        this.appConfig.showAlertMsg("", this.appMsgConfig.MobileDigitLimit);
      }
    }

    return isValid;
  }

  checkEmail() {
    if (!this.client.email) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmailRequiredMsg);
      return false;
    } else if (!this.appConfig.validateEmail(this.client.email)) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmailValidMsg);
      return false;
    } else {
      return true;
    }
  }

  checkIsActive() {
    let isValid = true;

    if (this.client.create_login == true && this.client.is_active == false) {
      this.appConfig.showAlertMsg("", "The is_active field is required when login is checked.");
      isValid = false;
    }

    return isValid;
  }

  checkOpeningBalance() {
    let isValid = true;

    if (this.client.opening_balance != null && this.client.opening_balance.toString().trim() != "") {
      if (isNaN(this.client.opening_balance)) {
        isValid = false;
        this.appConfig.showAlertMsg("", this.appMsgConfig.OpeningBalanceNumeric);
      } else if (this.client.opening_balance_type != null && this.client.opening_balance_type.toString().trim() == "") {
        isValid = false;
        this.appConfig.showAlertMsg("", this.appMsgConfig.ClientOpeningBalanceType);
      }
    }

    return isValid;
  }

  checkOpeningBalanceType() {
    let isValid = true;

    if (this.client.opening_balance_type != null && this.client.opening_balance_type.toString().trim() != "") {
      if (this.client.opening_balance != null && this.client.opening_balance.toString().trim() == "") {
        isValid = false;
        this.appConfig.showAlertMsg("", this.appMsgConfig.ClientOpeningBalance);
      }
    }

    return isValid;
  }

  checkGroupBillingClient() {
    let isValid = true;

    if (this.client.group_billing != null && this.client.group_billing.toString().toLowerCase().trim() == "yes") {
      if (this.client.other_client_id != null && this.client.other_client_id.toString().trim() == "") {
        isValid = false;
        this.appConfig.showAlertMsg("", this.appMsgConfig.OtherClientSelect);
      }
    }

    return isValid;
  }

  hasValidateData() {
    let isValidate = true;

    if (!this.checkFirstName()) {
      isValidate = false;
    } else if (!this.checkEmail()) {
      isValidate = false;
    } else if (!this.checkMobileNo()) {
      isValidate = false;
    } else if (!this.checkAddress()) {
      isValidate = false;
    } else if (!this.checkClientType()) {
      isValidate = false;
    } else if (!this.checkState()) {
      isValidate = false;
    } else if (!this.checkCities()) {
      isValidate = false;
    } else if (!this.checkIsActive()) {
      isValidate = false;
    } else if (!this.checkOpeningBalance()) {
      isValidate = false;
    } else if (!this.checkOpeningBalanceType()) {
      isValidate = false;
    } else if (!this.checkGroupBillingClient()) {
      isValidate = false;
    }

    return isValidate;
  }

  onClickEditClientContact() {
    if (this.hasValidateData()) {
      this.client.service = this.mTempServiceData;
      this.client.api_token = this.api_token;
      this.client._method = "patch";
      this.client.is_active = (this.client.is_active == true) ? "yes" : "no";
      // this.setClientNumber(this.client.numbers);

      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);

        this.clientService.editClient(this.clientId, this.client, this.mClientData).then(result => {
          if (result != null) {
            this.appConfig.hideLoading();

            this.apiResult = result;

            if (this.apiResult.success) {
              this.navCtrl.setRoot(ClientListPage);
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                this.multipleError(this.apiResult);
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
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    }
  }

  onSearchSelectChangeValue(data) {
    // console.log(data);

    if (data.element.id == "txtClientType") {
      this.client.client_type = data.data.key;
    } else if (data.element.id == "txtClientGroupId") {
      this.client.client_group_id = data.data.key;
    } else if (data.element.id == "txtClientCountryId") {
      this.client.country_id = data.data.key;
      this.onChangeGetState('states');
    } else if (data.element.id == "txtClientStateId") {
      this.client.state_id = data.data.key;
      this.onChangeGetCity('cities');
    } else if (data.element.id == "txtClientCityId") {
      this.client.city_id = data.data.key;
    } else if (data.element.id == "txtClientOpeningType") {
      this.client.opening_balance_type = data.data.key;
    } else if (data.element.id == "txtClientGroupBilling") {
      this.client.group_billing = data.data.key;

      let tempValue = data.data.value.toString().toLowerCase();
      if (tempValue == "" || tempValue == "no") {
        this.client.other_client_id = "";
      }
    } else if (data.element.id == "txtOtherClientId") {
      this.client.other_client_id = data.data.key;
    }
  }

}
