import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ExpensesService } from '../../../providers/expenses-service/expenses-service';

@Component({
  selector: 'page-expenses-add',
  templateUrl: 'expenses-add.html'
})

export class ExpensesAddPage {

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public expensesService: ExpensesService) {
  }



}
