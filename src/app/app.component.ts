import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';

// Providers
import { AppCommonConfig } from '../providers/AppCommonConfig';
import { UserServiceProvider } from '../providers/user-service/user-service';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  charClassName: string = "text-a";

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public appCommonConfig: AppCommonConfig,
    public userService: UserServiceProvider,
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
        if (value['success']) {
          this.appCommonConfig.mUserData = value['user'];

          this.appCommonConfig.mUserEmail = value['user'].email;
          this.appCommonConfig.mUserName = value['user'].first_name + " " + value['user'].last_name;
          this.appCommonConfig.mUserNameChar = this.appCommonConfig.mUserName.substr(0, 1);

          if (value['user'] != null && value['user'].roles[0]) {
            if (value['user'].roles[0].permissions != null) {
              this.appCommonConfig.userPermission = value['user'].roles[0].permissions;
            }

            if (value['user'].roles[0].client_permissions != null) {
              this.appCommonConfig.clientPermission = value['user'].roles[0].client_permissions;
            }
          }

          //this.appCommonConfig.setUserPermissions();
          //this.appCommonConfig.setUserdata();
          this.rootPage = DashboardPage;
        } else {
          this.appCommonConfig.mUserData = null;
          this.appCommonConfig.mUserEmail = "";
          this.appCommonConfig.mUserName = "";
          this.appCommonConfig.mUserNameChar = this.appCommonConfig.mUserName.substr(0, 1);

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

  doLogout() {
    if (this.appCommonConfig.hasConnection()) {
      let token = this.appCommonConfig.mUserData.api_token;
      this.userService.logout(token).then(success => {
        if (success) {
          this.appCommonConfig.clearLocalStorage();
          this.appCommonConfig.showNativeToast("Logout successfully.", "bottom", 3000);
          this.nav.setRoot(LoginPage);
        } else {
          this.appCommonConfig.showNativeToast("Network Error.", "bottom", 3000);
        }
      });
    } else {
      this.appCommonConfig.showAlertMsg("Internet Connection", "No internet connection available.");
    }
  }

}
