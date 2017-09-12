import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { TaskService } from '../../../providers/task-service/task-service';


@Component({
  selector: 'page-task-search',
  templateUrl: 'task-search.html'
})

export class TaskSearchPage {
  public api_token = this.appConfig.mToken;

  public apiResult: any;

  public mTaskCreatedDate: any;
  public mTaskOverdueDate: any;

  public mTaskClientGroupDD: any = [];
  public mTaskClientDD: any = [];
  public mTaskEmployeeDD: any = [];
  public mTaskPriorityDD: any = [];
  public mTaskServiceDD: any = [];
  public mTaskCreatorNameDD: any = [];

  public taskSearch: any = {
    client_group_id: "0",
    client_id: "0",
    employee_id: "0",
    priority_id: "0",
    description: "",
    service_id: "0",
    create_user_id: "0",
    created_date: "",
    overdue_date: ""
  };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public taskService: TaskService,
    public eventsCtrl: Events) {
  }

  ionViewDidEnter() {
    // this.taskService.clearTaskSearch();

    this.getTaskSearchDD();
    this.taskSearch = this.taskService.getTaskSearch();
    console.log(this.taskSearch);
    if(this.taskSearch.created_date != null && this.taskSearch.created_date != ""){
        this.mTaskCreatedDate = this.appConfig.stringToDateToISO(this.taskSearch.created_date);
    }
    if(this.taskSearch.overdue_date != null && this.taskSearch.overdue_date != ""){
        this.mTaskOverdueDate = this.appConfig.stringToDateToISO(this.taskSearch.overdue_date);
    }

    this.eventsCtrl.subscribe("search-select:refresh_value", (data) => {
      this.onSearchSelectChangeValue(data);
    });
  }

  ionViewDidLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");

    setTimeout(() => {
      this.eventsCtrl.publish('task:load_data');
    }, 100);
  }

  onClickSearchTask() {
    if(this.mTaskCreatedDate != null && this.mTaskCreatedDate != ""){
        this.taskSearch.created_date = this.appConfig.transformDate(this.mTaskCreatedDate);
    }
    if(this.mTaskOverdueDate != null && this.mTaskOverdueDate != ""){
        this.taskSearch.overdue_date = this.appConfig.transformDate(this.mTaskOverdueDate);
    }
    this.taskService.setTaskSearch(this.taskSearch);

    this.navCtrl.pop();
  }

  clearSearchData() {
    this.taskService.clearTaskSearch();
    // this.taskSearch = this.taskService.getTaskSearch();

    this.taskSearch.client_group_id = "0";
    this.taskSearch.client_id = "0";
    this.taskSearch.employee_id = "0";
    this.taskSearch.priority_id = "0";
    this.taskSearch.service_id = "0";
    this.taskSearch.service_id = "0";
    this.taskSearch.create_user_id = "0";
  }

  getTaskSearchDD() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.taskService.getSearchDropDown(this.api_token).then(data => {
        if (data != null) {
          this.appConfig.hideLoading();

          this.apiResult = data;
          // console.log(this.apiResult);

          if (this.apiResult.success) {
            this.setSearchDD(this.apiResult);
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
      })
    } else {
      this.appConfig.showNativeToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000);
    }
  }

  setSearchDD(data) {
    // console.log(data);

    if (data.group != null) {
      let mTaskClientGroupDD = [];

      Object.keys(data.group).forEach(function(key) {
        mTaskClientGroupDD.push({ 'key': key, 'value': data.group[key] });
      });

      this.mTaskClientGroupDD = mTaskClientGroupDD;
    }

    if (data.clients != null) {
      let mTaskClientDD = [];

      Object.keys(data.clients).forEach(function(key) {
        mTaskClientDD.push({ 'key': key, 'value': data.clients[key] });
      });

      this.mTaskClientDD = mTaskClientDD;
    }

    if (data.employees != null) {
      let mTaskEmployeesDD = [];

      Object.keys(data.employees).forEach(function(key) {
        mTaskEmployeesDD.push({ 'key': key, 'value': data.employees[key] });
      });

      this.mTaskEmployeeDD = mTaskEmployeesDD;
    }

    if (data.priority != null) {
      let mTaskPriorityDD = [];

      Object.keys(data.priority).forEach(function(key) {
        mTaskPriorityDD.push({ 'key': key, 'value': data.priority[key] });
      });

      this.mTaskPriorityDD = mTaskPriorityDD;
    }

    if (data.service != null) {
      let mTaskServiceDD = [];

      Object.keys(data.service).forEach(function(key) {
        mTaskServiceDD.push({ 'key': key, 'value': data.service[key] });
      });

      this.mTaskServiceDD = mTaskServiceDD;
    }

    if (data.creator_name != null) {
      let mTaskCreaterDD = [];

      Object.keys(data.creator_name).forEach(function(key) {
        mTaskCreaterDD.push({ 'key': key, 'value': data.creator_name[key] });
      });

      this.mTaskCreatorNameDD = mTaskCreaterDD;
    }
  }

  onSearchSelectChangeValue(data) {
    // console.log(data);

    if (data.element.id == "txtClientGroupId") {
      this.taskSearch.client_group_id = data.data.key;
    } else if (data.element.id == "txtClientId") {
      this.taskSearch.client_id = data.data.key;
    } else if (data.element.id == "txtEmployeeId") {
      this.taskSearch.employee_id = data.data.key;
    } else if (data.element.id == "txtPriorityId") {
      this.taskSearch.priority_id = data.data.key;
    } else if (data.element.id == "txtServiceId") {
      this.taskSearch.service_id = data.data.key;
    } else if (data.element.id == "txtCreatorId") {
      this.taskSearch.create_user_id = data.data.key;
    }
  }

}
