import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';

// Providers
import { AppConfig } from '../providers/AppConfig';
import { UserServiceProvider } from '../providers/user-service/user-service';

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
    public appConfig: AppConfig,
    public userService: UserServiceProvider,
  ) {
    this.pages = [
      { title: 'Dashboard', component: DashboardPage }
    ];

    this.platform.ready().then(() => {
      if (this.appConfig.isRunOnMobileDevice()) {
        this.statusBar.styleDefault();
      }

      this.setPageRedirect();
    });
  }

  setPageRedirect() {
    this.appConfig.checkLogin().then(value => {
      if (value != null) {
        if (value['success']) {
          this.appConfig.mUserData = value['user'];

          this.appConfig.mUserEmail = value['user'].email;
          this.appConfig.mUserName = value['user'].first_name + " " + value['user'].last_name;
          this.appConfig.mUserNameChar = this.appConfig.mUserName.substr(0, 1);

          if (value['user'] != null && value['user'].roles[0]) {
            if (value['user'].roles[0].permissions != null) {
              this.appConfig.userPermission = value['user'].roles[0].permissions;
            }

            if (value['user'].roles[0].client_permissions != null) {
              this.appConfig.clientPermission = value['user'].roles[0].client_permissions;
            }
          }

          this.rootPage = DashboardPage;
        } else {
          this.appConfig.mUserData = null;
          this.appConfig.mUserEmail = "";
          this.appConfig.mUserName = "";
          this.appConfig.mUserNameChar = this.appConfig.mUserName.substr(0, 1);

          this.rootPage = LoginPage;
        }
      }
    });

    if (this.appConfig.isRunOnMobileDevice()) {
      this.splashScreen.hide();
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  doLogout() {
    if (this.appConfig.hasConnection()) {
      let token = this.appConfig.mUserData.api_token;
      this.userService.logout(token).then(success => {
        if (success) {
          this.appConfig.clearLocalStorage();
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
