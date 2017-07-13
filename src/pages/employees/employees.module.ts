import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeesPage,EmployeeListPopoverPage } from './list/employees';
import { EmployeesAddPage } from './add/employee-add';

import { EmployeeService } from '../../providers/employee/employee-service';

@NgModule({
  declarations: [
    EmployeesPage,
    EmployeeListPopoverPage,
    EmployeesAddPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeesPage),
  ],
  exports: [
    EmployeesPage
  ],
  entryComponents: [
    EmployeeListPopoverPage,
    EmployeesAddPage
  ],
  providers: [
     EmployeeService,
  ]
})
export class EmployeesPageModule {}
