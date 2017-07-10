import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-all-pending-task',
  templateUrl: 'all-pending-task.html'
})

export class AllPendingTaskListPage {
  constructor(
    public navCtrl: NavController,
    public eventsCtrl: Events) {

  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_data', (data) => {
      console.log("call get all pending task api.");
    });
  }

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('task:load_data');
  }

  onAddClick() {
    console.log("called.....");
  }

}
