import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { EmployeeService } from '../../../providers/employee/employee-service';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-employee-add',
  templateUrl: 'employee-add.html',
})

export class EmployeesAddPage {
  @ViewChild('content') mContent;

  public allDDapiResult: any;
  public apiResult: any;
  public mStateDD: any = [];
  public mCitiesDD: any = [];
  public mBloodGroupDD: any = [];
  public mDepartmentsDD: any = [];
  public mEmployeeTypesDD: any = [];
  public mLeaveTypesDD: any = [];
  public mRoleListDD: any = [];

  public title: string = "add";
  public item_id: string = null;
  public isEdit: boolean = false;
  public token: string = this.appConfig.mUserData.user.api_token;
  myDate: string = new Date().toISOString();
  maxDate: string = this.myDate;

  public employee: any = {
    api_token: this.token,
    birth_date: this.maxDate,
    is_active: 'on',
    role_id:"" ,
    leave_type_id: ""
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public employeeService: EmployeeService,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public popoverCtrl: PopoverController,
    public eventsCtrl: Events) {
    if (this.navParams.get('item_id') != null) {
      this.item_id = this.navParams.get('item_id');
      this.title = "edit";
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
      this.mCitiesDD = this.getFormattedArray(data.cities);
      this.mDepartmentsDD = this.getFormattedArray(data.departments);
      this.mEmployeeTypesDD = this.getFormattedArray(data.employee_types);
      this.mBloodGroupDD = this.getFormattedArray(data.blood_group);
      this.mLeaveTypesDD = this.getFormattedArray(data.leave_types);
      this.mRoleListDD = this.getFormattedArray(data.role_list);
    }else {
      this.clearAllDD();
    }
  }

  clearAllDD(){
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
      mDropdown.push({"key":e , "value": object[e]})
    });
    return mDropdown;
  }

  onEmployeeChange($event){
    console.log($event);
  }


  getEmployeeDetail(showLoading){

    if(this.appConfig.hasConnection()){
      if(showLoading){
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }
      this.employeeService.getEmployeeDetail(this.token,this.item_id).then(data => {
        if (data != null) {
          this.apiResult = data;
          if (this.apiResult.success) {
              this.setEmployeeData(this.apiResult.employee);
              this.setEmployeeAllDDData(this.apiResult);
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
        if(showLoading){
          this.appConfig.hideLoading();
        }
      }, error => {
        if(showLoading){
          this.appConfig.hideLoading();
        }
        this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
      });
    }else{
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setEmployeeData(data){
    this.employee  = {
      "role_id" : (data.roleid != null && data.roleid.role_id != null) ? data.roleid.role_id : "",
      "leave_type_id" : (data.employee_leave_type != null && data.employee_leave_type.leave_type_id ) ? data.employee_leave_type.leave_type_id : "",
      "api_token" : this.token,
      "birth_date" : data.birth_date,
      "is_active" : data.is_active,
      "email": data.email,
      "first_name":data.first_name,
      "last_name": data.last_name,
      "address": data.address,
      "state_id": data.state_id,
      "city_id": data.city_id,
      "department_id": data.department_id,
      "phone": data.phone,
      "mobile": data.mobile,
      "emergencynumber": data.emergencynumber,
      "salary": data.salary,
      "blood_group" : data.blood_group
    }
  }

  onAddEmployee(){
    console.log(this.employee);
    if(this.appConfig.hasConnection()){
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      this.employeeService.addEmployeeData(this.employee).then(data => {
        if (data != null) {
          this.apiResult = data;
          if (this.apiResult.success) {
              this.navCtrl.pop();
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
    }else{
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  onEditEmployee(){
    this.employee.api_token = this.token;
    this.employee._method = "patch";
    console.log(this.employee);
    if(this.appConfig.hasConnection()){
      this.appConfig.showLoading(this.appMsgConfig.Loading);
      this.employeeService.editEmployeeData(this.employee,this.item_id).then(data => {
        if (data != null) {
          this.apiResult = data;
          if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.EmployeesEditSuccess, "bottom", 3000);
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
    }else{
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }
}
