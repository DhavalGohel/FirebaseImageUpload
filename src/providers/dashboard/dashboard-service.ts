import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class DashboardService {

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }

  getDashboardData(token?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.get(this.appConfig.API_URL + 'v1/ca/dashboard?api_token=' + token, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

}
