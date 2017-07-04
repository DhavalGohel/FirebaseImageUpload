import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../providers/AppConfig';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig) {
  }

}
