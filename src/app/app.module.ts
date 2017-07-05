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
import { DashboardClientPage } from '../pages/dashboard/client/dashboard-client';
import { ClientGroupListPage } from '../pages/client-group/list/client-group-list';

// Providers
import { AppConfig } from '../providers/AppConfig';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { DashboardService } from '../providers/dashboard/dashboard-service';


@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    LoginPage,
    ForgetPasswordPage,
    DashboardCAPage,
    ClientGroupListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
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
    ClientGroupListPage
  ],
  providers: [
    AppConfig,
    UserServiceProvider,
    DashboardService,
    Network,
    StatusBar,
    SplashScreen,
    Toast,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule { }
