import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class ClientGroupService {

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }

  // For Get Client Group Listing
  getClientGroupList(token?: string, search_text?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientgroup?api_token=' + token;

    if (search_text != null && search_text != ""){
      api_url = api_url + "&search=" + search_text.trim();
    }

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.get(api_url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Add Client Group
  addClientGroup(post_params?: any, options?: RequestOptions){
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientgroup', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Edit and Delete Client Group
  actionClientGroup(id?: string, post_params?: any, options?: RequestOptions){
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientgroup/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Client Group Details
  getClientGroupDetail(id?: string, api_token?: string, options?: RequestOptions){
    let api_url = this.appConfig.API_URL + 'v1/ca/clientgroup/' + id +'/edit?api_token=' + api_token;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.get(api_url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

}
