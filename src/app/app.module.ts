import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { DatePipe } from '@angular/common';

// Native Plugins
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { Keyboard } from '@ionic-native/keyboard';
import { Push } from '@ionic-native/push';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';

import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { DashboardCAPage } from '../pages/dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../pages/dashboard/Client/dashboard-client';

import { ClientListPage, ClientPopoverPage } from '../pages/client/list/client';
import { ClientAddPage} from '../pages/client/add/client-add';
import { ClientEditPage } from '../pages/client/edit/client-edit';
import { ClientDetailPage } from '../pages/client/detail/client-detail';
import { ClientExtraFieldPage }from '../pages/client/clientextrafield/client-extra-field';

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
import { TaskEditPage } from '../pages/task/edit/task-edit';
import { TaskSearchPage } from '../pages/task/search/task-search';
import { TaskCommentUploadedDocPage } from '../pages/task/comment/uploaded-document-list/uploaded-document-list';
import { TaskCommentPage, CommentTaskPopoverPage } from '../pages/task/comment/task-comment';

// Employee pages
import { EmployeesPage, EmployeeListPopoverPage } from '../pages/employees/list/employees';
import { EmployeesAddPage } from '../pages/employees/add/employee-add';


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
import { ClientService } from '../providers/client/client-service';
import { PushService } from '../providers/push-service/push-service';
import { EmployeeService } from '../providers/employee/employee-service';
import { KeyboardAttachDirective } from '../pages/keyboard-attach.directive';
import { ModalSelect, ModalSelectModal } from '../pages/modals/select-search/select-search';

// Module
import { TaskCompleteModal } from '../pages/modals/task-complete/task-complete';
import { TaskSpentTimeModal } from '../pages/modals/task-spent-time/task-spent-time';
import { PipesModule } from '../pipes/pipes.modules';


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
    ClientListPage,
    ClientAddPage,
    ClientEditPage,
    ClientDetailPage,
    ClientExtraFieldPage,
    ClientPopoverPage,
    ClientContactPage,
    ClientContactAddPage,
    ClientContactEditPage,
    ClientContactPopoverPage,
    [KeyboardAttachDirective],
    [ModalSelect],
    ModalSelectModal,
    TaskListPage,
    TaskAddPage,
    TaskEditPage,
    TaskSearchPage,
    TaskCommentPage,
    CommentTaskPopoverPage,
    TaskCommentUploadedDocPage,
    EmployeesPage,
    EmployeesAddPage,
    EmployeeListPopoverPage,
    AllPendingTaskListPage,
    AllPendingTaskPopoverPage,
    AllCompletedTaskListPage,
    AllCompletedTaskPopoverPage,
    MyCompletedTaskListPage,
    MyCompletedTaskPopoverPage,
    MyPendingTaskListPage,
    MyPendingTaskPopoverPage,
    ConnectionPage,
    TaskCompleteModal,
    TaskSpentTimeModal
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipesModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'md-arrow-back',
      tabsHighlight: true,
      tabsPlacement: 'top',
      tabsHideOnSubPages: true,
      scrollAssist: true,
      autoFocusAssist:false
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
    ClientListPage,
    ClientAddPage,
    ClientEditPage,
    ClientDetailPage,
    ClientExtraFieldPage,
    ClientPopoverPage,
    ClientContactPage,
    ClientContactAddPage,
    ClientContactEditPage,
    ClientContactPopoverPage,
    ModalSelectModal,
    TaskListPage,
    TaskAddPage,
    TaskEditPage,
    TaskSearchPage,
    TaskCommentPage,
    CommentTaskPopoverPage,
    TaskCommentUploadedDocPage,
    EmployeesPage,
    EmployeesAddPage,
    EmployeeListPopoverPage,
    AllPendingTaskListPage,
    AllPendingTaskPopoverPage,
    AllCompletedTaskListPage,
    AllCompletedTaskPopoverPage,
    MyCompletedTaskListPage,
    MyCompletedTaskPopoverPage,
    MyPendingTaskListPage,
    MyPendingTaskPopoverPage,
    ConnectionPage,
    TaskCompleteModal,
    TaskSpentTimeModal
  ],
  providers: [
    AppConfig,
    AppMsgConfig,
    UserServiceProvider,
    DashboardService,
    TaskService,
    ClientService,
    ClientGroupService,
    ClientContactService,
    PushService,
    EmployeeService,
    Network,
    StatusBar,
    SplashScreen,
    Toast,
    Keyboard,
    DatePipe,
    Push,
    Camera,
    File,
    FilePath,
    FileTransfer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})

export class AppModule { }
