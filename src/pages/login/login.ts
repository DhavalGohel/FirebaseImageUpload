import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user: any = {
    email: "",
    password: ""
  };

  data: any = {};

  constructor(public navCtrl: NavController) {

  }

  doLogin() {
    
  }
}
