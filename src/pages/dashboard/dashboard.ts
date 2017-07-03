import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppCommonConfig } from '../../providers/AppCommonConfig';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {

  constructor(
    public navCtrl: NavController,
    public appCommonConfig: AppCommonConfig) {

  }

  
}
