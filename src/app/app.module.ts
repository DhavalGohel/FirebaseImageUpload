import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

// Native Plugins
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';

import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { DashboardCAPage } from '../pages/dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../pages/dashboard/Client/dashboard-client';
import { ClientGroupListPage, ClientListPopoverPage } from '../pages/client-group/list/client-group-list';
import { ClientGroupAddPage } from '../pages/client-group/add/client-group-add';
import { ClientGroupEditPage } from '../pages/client-group/edit/client-group-edit';
import { CompanyPage } from '../pages/dashboard/Client/Company/company';
import { ClientContactPage, ClientContactPopoverPage } from '../pages/contact/list/contact';
import { ClientContactAddPage } from '../pages/contact/add/contact-add';
import { ClientContactEditPage } from '../pages/contact/edit/contact-edit';
import { ConnectionPage } from '../pages/connection/connection';

// TaskList Page
import { TaskListPage } from '../pages/task/list/task-list';
import { TaskAddPage } from '../pages/task/add/task-add';

import { AllPendingTaskListPage, AllPendingTaskPopoverPage } from '../pages/task/list/all-pending/all-pending-task';
import { AllCompletedTaskListPage, AllCompletedTaskPopoverPage } from '../pages/task/list/all-completed/all-completed-task';
import { MyPendingTaskListPage, MyPendingTaskPopoverPage } from '../pages/task/list/my-pending/my-pending-task';
import { MyCompletedTaskListPage, MyCompletedTaskPopoverPage } from '../pages/task/list/my-completed/my-completed-task';

// Providers
import { AppConfig, AppMsgConfig } from '../providers/AppConfig';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { DashboardService } from '../providers/dashboard/dashboard-service';
import { TaskService } from '../providers/task-service/task-service';
import { ClientGroupService } from '../providers/client-group/client-group-service';
import { ClientContactService } from '../providers/contact/contact-service';


// Module

import { EmployeesPageModule } from '../pages/employees/employees.module';


@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    LoginPage,
    ForgetPasswordPage,
    DashboardCAPage,
    ClientGroupListPage,
    ClientListPopoverPage,
    ClientGroupAddPage,
    ClientGroupEditPage,
    DashboardClientPage,
    CompanyPage,
    ClientContactPage,
    ClientContactAddPage,
    ClientContactEditPage,
    ClientContactPopoverPage,
    TaskListPage,
    TaskAddPage,
    AllPendingTaskListPage,
    AllPendingTaskPopoverPage,
    AllCompletedTaskListPage,
    AllCompletedTaskPopoverPage,
    MyCompletedTaskListPage,
    MyCompletedTaskPopoverPage,
    MyPendingTaskListPage,
    MyPendingTaskPopoverPage,
    ConnectionPage
   ],
  imports: [
    BrowserModule,
    HttpModule,
    EmployeesPageModule,
    IonicModule.forRoot(MyApp, {
      backButtonText:'',
      backButtonIcon: 'md-arrow-back',
      tabsHighlight: true,
      tabsPlacement: 'top',
      tabsHideOnSubPages: true,
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    LoginPage,
    ForgetPasswordPage,
    DashboardCAPage,
    ClientGroupListPage,
    ClientListPopoverPage,
    ClientGroupAddPage,
    ClientGroupEditPage,
    DashboardClientPage,
    CompanyPage,
    ClientContactPage,
    ClientContactAddPage,
    ClientContactEditPage,
    ClientContactPopoverPage,
    TaskListPage,
    TaskAddPage,
    AllPendingTaskListPage,
    AllPendingTaskPopoverPage,
    AllCompletedTaskListPage,
    AllCompletedTaskPopoverPage,
    MyCompletedTaskListPage,
    MyCompletedTaskPopoverPage,
    MyPendingTaskListPage,
    MyPendingTaskPopoverPage,
    ConnectionPage
   ],
  providers: [
    AppConfig,
    AppMsgConfig,
    UserServiceProvider,
    DashboardService,
    TaskService,
    ClientGroupService,
    ClientContactService,
    Network,
    StatusBar,
    SplashScreen,
    Toast,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})

export class AppModule { }
