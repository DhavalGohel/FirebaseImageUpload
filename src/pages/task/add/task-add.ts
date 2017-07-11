
import { Component  } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-task-add',
  templateUrl: 'task-add.html'
})

export class TaskAddPage
{
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
){}


}
