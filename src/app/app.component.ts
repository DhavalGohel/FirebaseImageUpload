import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events ,MenuController} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { AppConfig, AppMsgConfig } from '../providers/AppConfig';
import { UserServiceProvider } from '../providers/user-service/user-service';

// Pages
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { DashboardCAPage } from '../pages/dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../pages/dashboard/Client/dashboard-client';

import { ClientGroupListPage } from '../pages/client-group/list/client-group-list';
import { ClientContactPage } from '../pages/contact/list/contact';
import { TaskListPage } from '../pages/task/list/task-list';
import { EmployeesPage } from '../pages/employees/list/employees';
import { ClientListPage } from '../pages/client/list/client'

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any, iconSrc: string }> = [];
  isSwipeEnable: boolean = false;

  // User Permission
  public clientView: boolean = false;
  public clientGroupView: boolean = false;
  public contactsView: boolean = false;
  public taskView: boolean = false;
  public employeeView: boolean = false;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userService: UserServiceProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public eventsCtrl: Events,
    public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      if (this.appConfig.isRunOnMobileDevice()) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      if (this.appConfig.isRunOnIos()) {
        this.isSwipeEnable = true;
      }
      this.rootPage = SplashPage;
    });

    this.eventsCtrl.subscribe('menu:update', (data) => {
      this.setMenuItems();
    });
  }

  openPage(page) {
    this.menuCtrl.close();
    this.nav.setRoot(page.component);
  }

  doLogout() {
    this.menuCtrl.close();
    if (this.appConfig.hasConnection()) {
      // let token = this.appConfig.mUserData.user.api_token;

      this.userService.logout().then(success => {
        if (success) {
          this.appConfig.clearUserData();
          this.nav.setRoot(LoginPage);
          this.appConfig.showNativeToast(this.appMsgConfig.LogoutSuccessMsg, "bottom", 3000);
        } else {
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setPermissionData() {
    this.clientView = this.appConfig.hasUserPermissionByName('client', 'view');
    this.clientGroupView = this.appConfig.hasUserPermissionByName('client_group', 'view');
    this.contactsView = this.appConfig.hasUserPermissionByName('client_contact', 'view');
    this.employeeView = this.appConfig.hasUserPermissionByName('employee', 'view');
    this.taskView = this.appConfig.hasUserPermissionByName('tasks', 'view');
  }

  setMenuItems() {
    this.pages = [];
    if (this.appConfig.mUserType.toLowerCase() == 'client') {
      this.pages.push({ title: 'Dashboard', component: DashboardClientPage, iconSrc: 'assets/icon/menu/dashboard.png' });
    } else {
      this.setPermissionData();
      this.pages.push({ title: 'Dashboard', component: DashboardCAPage, iconSrc: 'assets/icon/menu/dashboard.png' });
      if (this.clientView) {
        this.pages.push({ title: 'Clients', component: ClientListPage, iconSrc: 'assets/icon/menu/client.png' });
      }

      if (this.contactsView) {
        this.pages.push({ title: 'Contacts', component: ClientContactPage, iconSrc: 'assets/icon/menu/contact.png' });
      }

      if (this.clientGroupView) {
        this.pages.push({ title: 'Client Group', component: ClientGroupListPage, iconSrc: 'assets/icon/menu/client_group.png' });
      }

      if (this.employeeView) {
        this.pages.push({ title: 'Employees', component: EmployeesPage, iconSrc: 'assets/icon/menu/employee.png' });
      }

      if (this.taskView) {
        this.pages.push({ title: 'Task', component: TaskListPage, iconSrc: 'assets/icon/menu/task.png' });
      }
    }
  }

}
