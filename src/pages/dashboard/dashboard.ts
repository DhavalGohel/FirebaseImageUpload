import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppCommonConfig } from '../../providers/AppCommonConfig';

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
    public appCommonConfig: AppCommonConfig) {
      this.setClinetPermission();
  }

  setClinetPermission(){
    let contact =  this.appCommonConfig.hasClientPermissionByName("contact");
    let documents =  this.appCommonConfig.hasClientPermissionByName("documents");
    let due_amount =  this.appCommonConfig.hasClientPermissionByName("due_amount");
    let expenses =  this.appCommonConfig.hasClientPermissionByName("expenses");
    let invoices =  this.appCommonConfig.hasClientPermissionByName("invoices");
    let notes =  this.appCommonConfig.hasClientPermissionByName("notes");
    let outstanding_amount =  this.appCommonConfig.hasClientPermissionByName("outstanding_amount");
    let task =  this.appCommonConfig.hasClientPermissionByName("task");
    let receipts =  this.appCommonConfig.hasClientPermissionByName("receipts");
    let services =  this.appCommonConfig.hasClientPermissionByName("services");

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
          delete: this.appCommonConfig.hasUserPermissionByName("account_department", "delete"),
          create: this.appCommonConfig.hasUserPermissionByName("account_department", "create"),
          update: this.appCommonConfig.hasUserPermissionByName("account_department", "update"),
          view: this.appCommonConfig.hasUserPermissionByName("account_department", "view"),
        },
      }]
  }

}
