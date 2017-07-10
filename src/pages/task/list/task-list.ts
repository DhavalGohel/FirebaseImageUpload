import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';

import { AllPendingTaskListPage } from '../list/all-pending/all-pending-task';
import { AllCompletedTaskListPage } from '../list/all-completed/all-completed-task';
import { MyPendingTaskListPage } from '../list/my-pending/my-pending-task';
import { MyCompletedTaskListPage } from '../list/my-completed/my-completed-task';

@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html'
})

export class TaskListPage {
  @ViewChild('taskListTabs') TaskListTabs: Tabs;

  public tabSelected: number = 0;
  public tabAllPendingTask: any = AllPendingTaskListPage;
  public tabAllCompletedTask: any = AllCompletedTaskListPage;
  public tabMyPendingTask: any = MyPendingTaskListPage;
  public tabMyCompletedTask: any = MyCompletedTaskListPage;

  constructor(public navCtrl: NavController) {

  }



}
