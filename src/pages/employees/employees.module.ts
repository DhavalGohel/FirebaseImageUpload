import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeesPage } from './list/employees';

@NgModule({
  declarations: [
    EmployeesPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeesPage),
  ],
  exports: [
    EmployeesPage
  ],
  entryComponents: [

  ],
  providers: [

  ]
})
export class EmployeesPageModule {}
