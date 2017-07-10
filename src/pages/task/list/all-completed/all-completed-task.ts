import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-all-completed-task',
  templateUrl: 'all-completed-task.html'
})

export class AllCompletedTaskListPage {
  constructor(
    public navCtrl: NavController,
    public eventsCtrl: Events) {

  }

  ionViewDidEnter() {
    this.eventsCtrl.subscribe('task:load_data', (data) => {
      console.log("call get all complete task api.");
    });
  }

  ionViewWillLeave(){
    this.eventsCtrl.unsubscribe('task:load_data');
  }

  onAddClick() {
    console.log("called.....");
  }

}
