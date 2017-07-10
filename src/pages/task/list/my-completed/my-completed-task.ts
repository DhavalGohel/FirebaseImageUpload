import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-my-completed-task',
  templateUrl: 'my-completed-task.html'
})

export class MyCompletedTaskListPage {
  constructor(
    public navCtrl: NavController,
    public eventsCtrl: Events) {

  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_data', (data) => {
      console.log("call get my completed task api.");
    });
  }

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('task:load_data');
  }

  onAddClick() {
    console.log("called.....");
  }

}
