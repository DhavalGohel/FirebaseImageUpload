import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ClientService } from '../../../providers/client/client-service';
import { ClientListPage } from '../list/client';

@Component({
  selector: 'page-client-add',
  templateUrl: 'client-add.html'
})

export class ClientAddPage {
  //@ViewChild('searchBar') mSearchBar

  public apiResult: any;
  public apiCitiesResilt: any;
  public api_token = this.appConfig.mToken;

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
  public mClientCountryDD: any = [];
  public mClientStateDD: any = [];
  public mClientCityDD: any = [];
  public mClientCitiesDD: any = [];
  public isCities: boolean = false;
  public isStates: boolean = false;
  public isCallCityDD = true;

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public clientService: ClientService
  ) {
    //  this.setServiceData();
    this.onloadGetCreateData();
  }

  onClickSetTab(tabName) {
    this.tab = tabName;
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

  onloadGetCreateData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.clientService.getClientCreateData(this.api_token).then(result => {
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

  setClientData(data) {
    this.client.client_id = data.client_id;
    this.client.client_prefix = data.client_prefix;
    this.client.country_id = data.country_id;
    this.client.create_login = false;
    this.client.is_active = true;
    this.client.numbers = [];
    this.servicesData = data.services;
    this.mClientData = data.client_data;

    this.setClientAllDDData(data);
    this.setServiceData();
  }

  setClientAllDDData(data) {
    if (data != null && Object.keys(data).length > 0) {
      if (data.client_types != null) {
        this.mClientTypeDD = this.getFormattedArray(data.client_types);
      }

      if (data.client_groups != null) {
        this.mClientGroupDD = this.getFormattedArray(data.client_groups);
      }

      if (data.countries != null) {
        this.mClientCountryDD = this.getFormattedArray(data.countries);
      }

      if (data.states != null) {
        this.mClientStateDD = this.getFormattedArray(data.states);
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

  onClickAddClientContact() {
    this.client.service = this.mTempServiceData;
    this.client.api_token = this.api_token;

    if (this.hasValidateData()) {
      if (this.appConfig.hasConnection()) {

        this.appConfig.showLoading(this.appMsgConfig.Loading);

        this.clientService.addClient(this.client, this.mClientData).then(result => {
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
                //this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
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

  multipleError(error) {
    let msg = [];
    Object.keys(error).forEach((item) => {
      msg += error[item];
    });
    this.appConfig.showAlertMsg(this.appMsgConfig.Error, msg);
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
    }
    return isValidate;
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
    if (!this.client.mobile) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileRequired);
      return false;
    } else if (isNaN(+this.client.mobile) || parseInt(this.client.mobile) < 0) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileDigitNumeric);
      return false;
    } else if (this.client.mobile.length != 10) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileDigitLimit);
      return false;
    } else {
      return true;
    }
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
      this.appConfig.showAlertMsg("", "The is active field is required when login is checked.");
      isValid = false;
    }

    return isValid;

    /*
    if ((!this.client.create_login && !this.client.is_active)
      || (this.client.create_login && this.client.is_active)) {
      return true;
    } else if (this.client.create_login && !this.client.is_active) {
      this.appConfig.showAlertMsg("", "Please check avtive");
      return false;
    } else {
      this.appConfig.showAlertMsg("", "Please check login");
      return false;
    }
    */
  }

  changeToggleLogin() {
    if (this.client.create_login) {
      this.client.is_active = true;
    }
  }

}
