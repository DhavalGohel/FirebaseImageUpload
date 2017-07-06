import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-dashboard-client',
  templateUrl: 'dashboard-client.html',
})
export class DashboardClientPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig) {

  }
}
