import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class ClientContactService {

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }

  // For Get Client Group Listing
  getClientContactDropDown(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientcontact/create?api_token=' + token;

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

  // For Get Client Contact Listing
  getClientContactList(token?: string, search_text?: string, client_id?: string, page?: number,options?: RequestOptions) {
    let api_url = this.appConfig.API_URL;

    if (client_id != null && client_id != "") {
      api_url = api_url + 'v2/ca/clientcontact?api_token=' + token + "&client_id=" + client_id;
    } else {
      api_url = api_url + 'v1/ca/clientcontact?api_token=' + token;
    }

    if (search_text != null && search_text != "") {
      api_url = api_url + "&search=" + search_text.trim();
    }

    api_url = api_url + "&page="+ page;

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

  // For Add Client Contact
  addClientContact(post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientcontact', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }



  // For Edit and Delete Client Contact
  actionClientContact(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientcontact/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Client Contact Details
  getClientContactDetail(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientcontact/' + id + '/edit?api_token=' + api_token;

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
