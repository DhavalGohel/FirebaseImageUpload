import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

@Component({
  selector: 'page-client-add',
  templateUrl: 'client-add.html'
})

export class ClientAddPage {
  public apiResult: any;

  public api_token = this.appConfig.mToken;

  public tab: string = 'basic_info';

  public client: any = {};
  public mClientContactCityDD: any = [];
  public mClientData: any = [
    {
      "name": "PAN No.",
      "id": 110
    },
    {
      "name": "VAT No.",
      "id": 111
    },
    {
      "name": "Service Tax No.",
      "id": 112
    },
    {
      "name": "UIN",
      "id": 113
    },
    {
      "name": "TAN",
      "id": 114
    },
    {
      "name": "IFSC",
      "id": 115
    },
    {
      "name": "Test",
      "id": 516
    }
  ];

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig)
  { }


  onClickSetTab(tabName) {
    console.log("tab name" + tabName);
    this.tab = tabName;
    console.log("this.tab" + this.tab);
    // if(this.tab == "basic_info"){
    //   this.tab = 'client_data';
    // }else if(this.tab == "client_data") {
    //   this.tab = 'service';
    // }
  }
}
