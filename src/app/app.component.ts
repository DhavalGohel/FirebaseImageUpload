import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';

// Providers
import { AppCommonConfig } from '../providers/AppCommonConfig';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public appCommonConfig: AppCommonConfig
  ) {
    this.pages = [
      { title: 'Dashboard', component: DashboardPage }
    ];

    this.platform.ready().then(() => {
      if (this.appCommonConfig.isRunOnMobileDevice()) {
        this.statusBar.styleDefault();
      }

      this.setPageRedirect();
    });
  }

  setPageRedirect() {
    this.appCommonConfig.checkLogin().then(value => {
      if (value != null) {
        if (value) {
          this.rootPage = DashboardPage;
          this.appCommonConfig.setUserPermissions();
        } else {
          this.rootPage = LoginPage;
        }
      }
    });

    if (this.appCommonConfig.isRunOnMobileDevice()) {
      this.splashScreen.hide();
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

}
