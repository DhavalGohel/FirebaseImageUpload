import { Injectable } from '@angular/core';
// import { Platform } from 'ionic-angular';

import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Injectable()
export class PushService {
  public pushObject: PushObject;

  public pushOptions: PushOptions = {
    android: {
      senderID: '412332765454',
      sound: true,
      vibrate: true
    },
    ios: {
      alert: 'true',
      badge: true,
      sound: 'false'
    },
    windows: {}
  };

  constructor(
    public pushCtrl: Push
  ) {
  }

  setPushNotificationData() {
    this.pushObject = this.pushCtrl.init(this.pushOptions);

    this.pushCtrl.hasPermission().then((result) => {
      console.log(result);

      if (result != null) {
        if (result.isEnabled) {
          this.registeredDevice();
        } else {
          console.log('We do not have permission to send push notifications');
        }
      }
    });
  }

  registeredDevice() {
    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log(registration);
      console.log(registration.registrationId);

      this.setNotificationObject();
      this.setErrorPushNotification();
    });
  }

  setNotificationObject() {
    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
    });
  }

  setErrorPushNotification() {
    this.pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
    });
  }

}
