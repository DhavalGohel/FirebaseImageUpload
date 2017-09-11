import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { DatePipe } from '@angular/common';

// Native Plugins
import { Device } from '@ionic-native/device';
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
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { DashboardCAPage } from '../pages/dashboard/CA/dashboard_ca';
import { DashboardClientPage } from '../pages/dashboard/Client/dashboard-client';

import { ClientListPage, ClientPopoverPage } from '../pages/client/list/client';
import { ClientAddPage } from '../pages/client/add/client-add';
import { ClientEditPage } from '../pages/client/edit/client-edit';
import { ClientDetailPage } from '../pages/client/detail/client-detail';
import { ClientExtraFieldPage } from '../pages/client/clientextrafield/client-extra-field';

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

// Invoice Pages
import { InvoiceListPage, InvoiceListPopoverPage } from '../pages/invoice/list/invoice-list';
import { InvoiceAddPage } from '../pages/invoice/add/invoice-add';
import { InvoiceEditPage } from '../pages/invoice/edit/invoice-edit';

// Receipt Pages
import { ReceiptListPage, ReceiptPopoverPage } from '../pages/receipt/list/receipt-list';
import { ReceiptAddPage } from '../pages/receipt/add/receipt-add';
import { ReceiptEditPage } from '../pages/receipt/edit/receipt-edit';

// Expenses Pages
import { ExpensesListPage, ExpensesPopoverPage } from '../pages/expenses/list/expenses-list';
import { ExpensesAddPage } from '../pages/expenses/add/expenses-add';
import { ExpensesEditPage } from '../pages/expenses/edit/expenses-edit';


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
import { ReceiptService } from '../providers/receipt-service/receipt-service';
import { InvoiceService } from '../providers/invoice-service/invoice-services';
import { ExpensesService } from '../providers/expenses-service/expenses-service';
import { KeyboardAttachDirective } from '../pages/keyboard-attach.directive';
import { ModalSelect, ModalSelectModal } from '../pages/modals/select-search/select-search';

// Module
import { TaskCompleteModal } from '../pages/modals/task-complete/task-complete';
import { TaskSpentTimeModal } from '../pages/modals/task-spent-time/task-spent-time';
import { PipesModule } from '../pipes/pipes.modules';
import { InvoiceSelectModel } from '../pages/modals/invoice-select/invoice-select';

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
    TaskSpentTimeModal,
    ReceiptListPage,
    ReceiptPopoverPage,
    ReceiptAddPage,
    ReceiptEditPage,
    InvoiceListPage,
    InvoiceListPopoverPage,
    InvoiceAddPage,
    InvoiceEditPage,
    InvoiceSelectModel,
    ExpensesListPage,
    ExpensesPopoverPage,
    ExpensesAddPage,
    ExpensesEditPage
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
    TaskSpentTimeModal,
    ReceiptListPage,
    ReceiptPopoverPage,
    ReceiptAddPage,
    ReceiptEditPage,
    InvoiceListPage,
    InvoiceListPopoverPage,
    InvoiceAddPage,
    InvoiceEditPage,
    InvoiceSelectModel,
    ExpensesListPage,
    ExpensesPopoverPage,
    ExpensesAddPage,
    ExpensesEditPage
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
    ReceiptService,
    InvoiceService,
    ExpensesService,
    Device,
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
    FileOpener,
    AppVersion,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})

export class AppModule { }
