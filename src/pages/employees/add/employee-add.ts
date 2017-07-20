import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { EmployeeService } from '../../../providers/employee/employee-service';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { EmployeesPage } from '../list/employees';

@Component({
  selector: 'page-employee-add',
  templateUrl: 'employee-add.html',
})

export class EmployeesAddPage {
  @ViewChild('content') mContent;

  public allDDapiResult: any;
  public apiResult: any;
  public apiCitiesResilt: any;
  public mStateDD: any = [];
  public mCitiesDD: any = [];
  public mBloodGroupDD: any = [];
  public mDepartmentsDD: any = [];
  public mEmployeeTypesDD: any = [];
  public mLeaveTypesDD: any = [];
  public mRoleListDD: any = [];

  public title: string = "add employee";
  public item_id: string = null;
  public isEdit: boolean = false;
  public isCities: boolean = false;

  public token: string = this.appConfig.mUserData.user.api_token;
  myDate: string = new Date().toISOString();
  maxDate: string = this.myDate;
  public mBirthdate: any;
  public is_active: boolean = false;

  public employee: any = {
    api_token: this.token,
    birth_date: "",
    role_id: "",
    leave_type_id: ""
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public employeeService: EmployeeService,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events,
  ) {
    if (this.navParams.get('item_id') != null) {
      this.item_id = this.navParams.get('item_id');
      this.title = "edit employee";
      this.getEmployeeDetail(true);
      this.isEdit = true;
    } else {
      this.getEmployeeAllDD();
    }
  }



  getEmployeeAllDD() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      this.employeeService.getEmployeeAllDD(this.token).then(data => {
        if (data != null) {
          this.allDDapiResult = data;
          if (this.allDDapiResult.success) {
            this.setEmployeeAllDDData(this.allDDapiResult);
          } else {
            if (this.allDDapiResult.error != null && this.allDDapiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.allDDapiResult.error);
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
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setEmployeeAllDDData(data) {
    if (data != null && Object.keys(data).length > 0) {
      this.mStateDD = this.getFormattedArray(data.states);
      this.mDepartmentsDD = this.getFormattedArray(data.departments);
      this.mEmployeeTypesDD = this.getFormattedArray(data.employee_types);
      this.mBloodGroupDD = this.getFormattedArray(data.blood_group);
      this.mLeaveTypesDD = this.getFormattedArray(data.leave_types);
      this.mRoleListDD = this.getFormattedArray(data.role_list);
    } else {
      this.clearAllDD();
    }
  }

  clearAllDD() {
    this.mStateDD = [];
    this.mCitiesDD = [];
    this.mDepartmentsDD = [];
    this.mEmployeeTypesDD = [];
    this.mBloodGroupDD = [];
    this.mLeaveTypesDD = [];
    this.mRoleListDD = [];
  }

  getFormattedArray(object: any) {
    let mDropdown = [];
    Object.keys(object).forEach(function(e) {
      mDropdown.push({ "key": e, "value": object[e] })
    });
    return mDropdown;
  }

  onStateChange() {
    this.getCitiesDD(this.employee.state_id);
  }

  getCitiesDD(data) {
    if (this.appConfig.hasConnection()) {
      let get_param = {
        "state_id": data
      };

      this.appConfig.showLoading(this.appMsgConfig.Loading);
      this.employeeService.getModuleDropDown(this.token, "cities", get_param).then(data => {
        if (data != null) {
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
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
        this.appConfig.hideLoading();
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
      this.mCitiesDD = this.getFormattedArray(data.cities);
    } else {
      this.showCities(false);
      this.mCitiesDD = [];
    }
  }
  showCities(value) {
    this.isCities = value;
  }


  getEmployeeDetail(showLoading) {

    if (this.appConfig.hasConnection()) {
      if (showLoading) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }
      this.employeeService.getEmployeeDetail(this.token, this.item_id).then(data => {
        if (data != null) {
          this.apiResult = data;
          if (this.apiResult.success) {
            this.setEmployeeData(this.apiResult.employee);
            this.setEmployeeAllDDData(this.apiResult);
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
        if (showLoading) {
          this.appConfig.hideLoading();
        }
      }, error => {
        if (showLoading) {
          this.appConfig.hideLoading();
        }
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setEmployeeData(data) {
    this.mBirthdate = this.appConfig.stringToDateToISO(data.birth_date);
    this.is_active = data.is_active;
    this.employee = {
      "role_id": (data.roleid != null && data.roleid.role_id != null) ? data.roleid.role_id : "",
      "leave_type_id": (data.employee_leave_type != null && data.employee_leave_type.leave_type_id) ? data.employee_leave_type.leave_type_id : "",
      "api_token": this.token,
      "is_active": (this.is_active == true) ? "1" : "0",
      "email": data.email,
      "first_name": data.first_name,
      "last_name": data.last_name,
      "address": data.address,
      "state_id": data.state_id,
      "city_id": data.city_id,
      "department_id": data.department_id,
      "phone": data.phone,
      "mobile": data.mobile,
      "emergencynumber": data.emergencynumber,
      "salary": data.salary,
      "blood_group": data.blood_group,
      "birth_date": this.appConfig.transformDate(this.mBirthdate)
    }
  }

  onAddEmployee() {
    if (this.hasValidateData()) {
      this.employee.birth_date = this.appConfig.transformDate(this.mBirthdate);
      this.employee.is_active = (this.is_active == true) ? "1" : "0";
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
        this.employeeService.addEmployeeData(this.employee).then(data => {
          if (data != null) {
            this.apiResult = data;
            if (this.apiResult.success) {
              setTimeout(() => {
                this.navCtrl.setRoot(EmployeesPage);
              }, 500);
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else if (this.apiResult.email != null && this.apiResult.email.length > 0) {
                this.appConfig.showAlertMsg("", this.apiResult.email[0]);
              } else if (this.apiResult.mobile_no != null && this.apiResult.mobile_no.length > 0) {
                this.appConfig.showAlertMsg("", this.apiResult.mobile_no[0]);
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
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        });
      } else {
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    }
  }

  onEditEmployee() {
    this.employee.api_token = this.token;
    this.employee._method = "patch";
    this.employee.is_active = (this.is_active == true) ? 1 : 0;
    if (this.hasValidateData()) {
      this.employee.birth_date = this.appConfig.transformDate(this.mBirthdate);
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
        this.employeeService.editEmployeeData(this.employee, this.item_id).then(data => {
          if (data != null) {
            this.apiResult = data;
            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.EmployeesEditSuccess, "bottom", 3000);
              setTimeout(() => {
                this.navCtrl.setRoot(EmployeesPage);
              }, 500);
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else if (this.apiResult.email != null && this.apiResult.email.length > 0) {
                this.appConfig.showAlertMsg("", this.apiResult.email[0]);
              } else if (this.apiResult.mobile_no != null && this.apiResult.mobile_no.length > 0) {
                this.appConfig.showAlertMsg("", this.apiResult.mobile_no[0]);
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
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        });
      } else {
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    }
  }


  hasValidateData() {
    let isValidate = true;
    if (!this.checkFirstName()) {
      isValidate = false;
    } else if (!this.checkLastName()) {
      isValidate = false;
    } else if (!this.checkAddress()) {
      isValidate = false;
    }
    // else if (!this.checkBirthdate()) {
    //   isValidate = false;
    // }
    else if (!this.checkState()) {
      isValidate = false;
    } else if (!this.checkCities()) {
      isValidate = false;
    } else if (!this.checkDepartment()) {
      isValidate = false;
    } else if (!this.checkRole()) {
      isValidate = false;
    } else if (!this.checkBloodGroup()) {
      isValidate = false;
    } else if (!this.checkPhoneNo()) {
      isValidate = false;
    } else if (!this.checkMobileNo()) {
      isValidate = false;
    } else if (!this.checkEmail()) {
      isValidate = false;
    } else if (!this.checkLeaveType()) {
      isValidate = false;
    }
    return isValidate;
  }

  checkFirstName() {
    if (this.employee.first_name != null && this.employee.first_name.trim() != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter First Name");
      return false;
    }
  }
  checkLastName() {
    if (this.employee.last_name != null && this.employee.last_name.trim() != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter Last Name");
      return false;
    }
  }

  checkAddress() {
    if (this.employee.address != null && this.employee.address != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter Address");
      return false;
    }
  }

  checkBirthdate() {
    if (this.mBirthdate != null && this.mBirthdate != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter Birthdate");
      return false;
    }
  }

  checkState() {
    if (this.employee.state_id != null && this.employee.state_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.SteteRequired);
      return false;
    }
  }

  checkCities() {
    if (this.employee.city_id != null && this.employee.city_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.CitiesRequired);
      return false;
    }
  }

  checkDepartment() {
    if (this.employee.department_id != null && this.employee.department_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmployeeDepartmentRequired);
      return false;
    }
  }

  checkRole() {
    if (this.employee.role_id != null && this.employee.role_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmployeeRoleRequired);
      return false;
    }
  }

  checkBloodGroup() {
    if (this.employee.blood_group != null && this.employee.blood_group != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmployeeBloodGroup);
      return false;
    }
  }

  checkPhoneNo() {
    if (this.employee.phone != null && this.employee.phone.trim() != "") {
      if (isNaN(+this.employee.phone) || parseInt(this.employee.phone) < 0) {
        this.appConfig.showAlertMsg("", this.appMsgConfig.EmployeePhoneNumeric);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  checkMobileNo() {
    if (this.employee.mobile == null && this.employee.mobile.trim() == "") {
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileRequired);
      return false;
    } else if (isNaN(+this.employee.mobile) || parseInt(this.employee.phone) < 0) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileDigitNumeric);
      return false;
    } else if (this.employee.mobile.length != 10) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.MobileDigitLimit);
      return false;
    }
     else {
      return true;
    }
  }

  checkEmail() {
    if (this.employee.email == null && this.employee.email == "") {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmailRequiredMsg);
      return false;
    } else if (!this.appConfig.validateEmail(this.employee.email)) {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmailValidMsg);
      return false;
    } else {
      return true;
    }
  }

  checkLeaveType() {
    if (this.employee.leave_type_id != null && this.employee.leave_type_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", this.appMsgConfig.EmployeeLeaveType);
      return false;
    }
  }

}
