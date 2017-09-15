import { Injectable } from '@angular/core';
import { Http, RequestOptions,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class DashboardService {
  public token: string = null;
  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }

  getImageData(token?: string, page? : number ,options?: RequestOptions) {
    let headers = new Headers();
    headers.append('Authorization', 'Client-ID 3407e5e6f16f2f1');
    if (!options) {
      options = new RequestOptions({headers: headers});
    }

    return new Promise((resolve, reject) => {
      this.http.get('https://api.unsplash.com/photos/?page='+page+'&client_id=befe3e4f57a08027cdc1560ad9dd94abaaa593e0a91e1d52801b71a2fec3659b', options)
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
}
