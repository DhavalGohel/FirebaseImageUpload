import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class UserServiceProvider {

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) { }

  loginPost(param?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/login', param, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    }).catch(err => {
      err( { "success" : false,
       "error": "" });
    });;

    // return this.http.post("http://dev.onzup.com/api/" + 'v1/login',param, options);
  }

  logout(param?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }
    return new Promise(resolve => {
      this.http.get(this.appConfig.API_URL + 'v1/logout?api_token=' + this.appConfig.mToken, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data != null) {
            resolve(data.success);
          } else {
            resolve(false);
          }
        }, (err) => {
          resolve(false);
        });
    });
  }

  forgetPasswordPost(param?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/password/reset', param, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    }).catch(err => {
      console.log(err);
    });
  }

  getCACompanyList(token?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    if (token != null && token != "") { token = token; } else { token = this.appConfig.mToken; }

    return new Promise(resolve => {
      this.http.get(this.appConfig.API_URL + 'v1/client/get-all-cas?api_token=' + token, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, (err) => {
          resolve(err.json())
        })
    }).catch(err => {
      console.log(err);
    });
  }

  getClientPermissions(clientId?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.get(this.appConfig.API_URL + 'v2/ca/client/' + clientId + '/permissions?is=active&api_token=' + this.appConfig.mToken, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, (err) => {
          resolve(err.json())
        })
    }).catch(err => {
      console.log(err);
    })
  }


}
