import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeesPage,EmployeeListPopoverPage } from './list/employees';

import { EmployeeService } from '../../providers/employee/employee-service';

@NgModule({
  declarations: [
    EmployeesPage,
    EmployeeListPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeesPage),
  ],
  exports: [
    EmployeesPage
  ],
  entryComponents: [
    EmployeeListPopoverPage
  ],
  providers: [
     EmployeeService
  ]
})
export class EmployeesPageModule {}
