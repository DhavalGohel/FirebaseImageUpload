import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {

  public title: string = "Dashboard";
  public clientDashboardPermission: any = {};
  public userDashboardPermission: any = {};

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig) {
      this.setClinetPermission();
  }

  setClinetPermission(){
    let contact =  this.appConfig.hasClientPermissionByName("contact");
    let documents =  this.appConfig.hasClientPermissionByName("documents");
    let due_amount =  this.appConfig.hasClientPermissionByName("due_amount");
    let expenses =  this.appConfig.hasClientPermissionByName("expenses");
    let invoices =  this.appConfig.hasClientPermissionByName("invoices");
    let notes =  this.appConfig.hasClientPermissionByName("notes");
    let outstanding_amount =  this.appConfig.hasClientPermissionByName("outstanding_amount");
    let task =  this.appConfig.hasClientPermissionByName("task");
    let receipts =  this.appConfig.hasClientPermissionByName("receipts");
    let services =  this.appConfig.hasClientPermissionByName("services");

    this.clientDashboardPermission = [{
      key :"contact",
      val : contact
    }, {
      key :"documents",
      val : documents
      }, {
        key :"due_amount",
        val : due_amount
      }, {
        key :"expenses",
        val : expenses
      }, {
        key :"invoices",
        val : invoices
      }, {
        key :"notes",
        val : notes
      }, {
        key :"outstanding_amount",
        val : outstanding_amount
      }, {
        key :"task",
        val : task
      }, {
        key :"receipts",
        val : receipts
      }, {
        key :"services",
        val : services
      }];

      this.userDashboardPermission = [{
        account_department: {
          delete: this.appConfig.hasUserPermissionByName("account_department", "delete"),
          create: this.appConfig.hasUserPermissionByName("account_department", "create"),
          update: this.appConfig.hasUserPermissionByName("account_department", "update"),
          view: this.appConfig.hasUserPermissionByName("account_department", "view"),
        },
      }]
  }

}
