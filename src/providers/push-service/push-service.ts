import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig, AppMsgConfig } from '../AppConfig';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';


@Injectable()
export class PushService {
  public apiResult: any;
  public pushObject: PushObject;

  public pushOptions: PushOptions = {
    android: {
      senderID: this.appConfig.mFirebaseSenderID,
      sound: true,
      vibrate: true
    },
    ios: {
      alert: 'true',
      badge: true,
      sound: 'true'
    },
    windows: {}
  };

  constructor(
    public http: Http,
    public pushCtrl: Push,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public device: Device,
    public appVersion: AppVersion) {
  }

  registerDevice(api_token?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/user/device-details?api_token=' + api_token, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch (e) {
            reject(err);
          }
        });
    });
  }

  setPushNotification() {
    if (this.appConfig.isRunOnMobileDevice()) {
      if (this.appConfig.isPushRegistered == false) {
        this.pushObject = this.pushCtrl.init(this.pushOptions);

        this.pushCtrl.hasPermission().then((result) => {
          // console.log(result);

          if (result != null) {
            if (result.isEnabled) {
              this.PushNotificationRegister();
            } else {
              this.appConfig.showAlertMsg('Push Notification', "Don't have permission to send & receive push notifications.");
            }
          }
        });
      }
    }
  }

  PushNotificationRegister() {
    this.pushObject.on('registration').subscribe((registration: any) => {
      this.pushObject.on('notification').subscribe((notification: any) => {
        this.HandlePushNotificationData(notification);
      });

      this.pushObject.on('error').subscribe(error => {
        this.HandleErrorPushNotification(error);
      });

      if (this.appConfig.hasConnection()) {
        // console.log(registration);

        let post_params = {
          'device_id': this.device.uuid,
          'device_token': registration.registrationId,
          'platform': this.device.platform
        };

        this.registerDevice(this.appConfig.mToken, post_params).then(data => {
          if (data != null) {
            this.apiResult = data;
            // console.log(this.apiResult);

            if (this.apiResult.success) {
              this.appConfig.isPushRegistered = true;
            } else {
              this.appConfig.isPushRegistered = false;
            }
          } else {
            this.appConfig.isPushRegistered = false;
          }
        }, error => {
          this.appConfig.isPushRegistered = false;
        });
      }
    });
  }

  HandlePushNotificationData(notification_data) {
    console.log('Received a notification', notification_data);
  }

  HandleErrorPushNotification(error) {
    console.log(error);
  }

  checkAppVersionUpdate() {
    if (this.appConfig.isRunOnMobileDevice()) {
      this.appVersion.getVersionNumber().then(version => {
        console.log(version);
      });
    }
  }

}
