import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { AppConfig, AppMsgConfig } from '../providers/AppConfig';
import { UserServiceProvider } from '../providers/user-service/user-service';

// Pages
import { LoginPage } from '../pages/login/login';
import { DashboardCAPage } from '../pages/dashboard/CA/dashboard_ca';
import { ClientGroupListPage } from '../pages/client-group/list/client-group-list';
import { SplashPage } from '../pages/splash/splash';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = SplashPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig
  ) {
    this.pages = [
      { title: 'Dashboard', component: DashboardCAPage },
      { title: 'Client Group', component: ClientGroupListPage }
    ];

    this.platform.ready().then(() => {
      if (this.appConfig.isRunOnMobileDevice()) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  doLogout() {
    if (this.appConfig.hasConnection()) {
      //      let token = this.appConfig.mUserData.user.api_token;
      this.userService.logout().then(success => {
        if (success) {
          this.appConfig.clearUserData();
          this.appConfig.showNativeToast("Logout successfully.", "bottom", 3000);

          this.nav.setRoot(LoginPage);
        } else {
          this.appConfig.showNativeToast("Network Error.", "bottom", 3000);
        }
      });
    } else {
      this.appConfig.showAlertMsg("Internet Connection", "No internet connection available.");
    }
  }

}
