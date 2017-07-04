import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {
  public taskListType: string = "my";

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig) {
  }

  openPage(pageName){
    console.log(pageName);
  }

  doChangeListType() {
    console.log("List Type : " + this.taskListType);
  }
}
