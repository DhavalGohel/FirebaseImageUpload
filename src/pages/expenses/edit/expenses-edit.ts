import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ExpensesService } from '../../../providers/expenses-service/expenses-service';

@Component({
  selector: 'page-expenses-edit',
  templateUrl: 'expenses-edit.html'
})

export class ExpensesEditPage {

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public expensesService: ExpensesService) {
  }



}
