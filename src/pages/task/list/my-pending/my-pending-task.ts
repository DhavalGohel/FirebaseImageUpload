import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-my-pending-task',
  templateUrl: 'my-pending-task.html'
})

export class MyPendingTaskListPage {
  constructor(
    public navCtrl: NavController,
    public eventsCtrl: Events) {

  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_data', (data) => {
      console.log("call get my pending task api.");
    });
  }

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('task:load_data');
  }

  onAddClick() {
    console.log("called...");
  }

}
