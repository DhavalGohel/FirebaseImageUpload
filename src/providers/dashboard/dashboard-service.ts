import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class DashboardService {
  public token: string = null;
  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
    this.token = this.appConfig.mToken;
  }

  getDashboardData(token?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(this.appConfig.API_URL + 'v1/ca/dashboard?api_token=' + token, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch (e) {
            reject(err)
          }
        });
    });
  }

  getSelectedCompany(param?: any, accountId?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/client/' + accountId + '/set-selected-ca', param, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, err => {
          try {
            resolve(err.json());
          } catch (e) {
            reject(err)
          }
        });
    });
  }

}
