import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppCommonConfig } from '../AppCommonConfig';

@Injectable()
export class UserServiceProvider {
  
  constructor(
    public http: Http,
    public appCommonConfig: AppCommonConfig
  ) { }

  loginPost(param?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appCommonConfig.API_URL + 'v1/login', param, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });

    // return this.http.post("http://dev.onzup.com/api/" + 'v1/login',param, options);
  }

  logout(token?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }
    return new Promise(resolve => {
      this.http.get(this.appCommonConfig.API_URL + 'v1/logout?api_token=' + token, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          if (data.success) {
            this.appCommonConfig.clearLocalStorage();
          }
          resolve(data.success);
        }, (err) => {
          console.log(err);
          resolve(false);
        });
    });
  }

}
