import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-client-add',
  templateUrl: 'client-add.html'
})

export class ClientAddPage
{
  public apiResult: any;

  public mAlertBox: any;
  public api_token = this.appConfig.mToken;
  public mClientContactDD: any = [];

  public mClientContactCityDD: any = [];

  public client: any = {
    type: "client",
    client_id: "",
    name: "",
    designation: "",
    mobile_no: "",
    email: "",
    address: "",
    city_id: "",
    api_token: this.api_token
  };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,

    //public clientContactService: ClientContactService
  ) {
    //this.getClientContactDropDownData(true);
  }

}
