import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class ClientDetailService {
  public clientId: string = "";

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }
  getClientId() {
    return this.clientId;
  }

  setClientId(id) {
    this.clientId = id;
  }

  removeClientId() {
    this.clientId = '';
  }
  // For Get Client Group Listing
  getClientContactDropDown(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientcontact/create?api_token=' + token;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
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

  // For Get Client Contact Listing
  getClientContactList(token?: string,  page?: number, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL;

    if (this.clientId != '') {
      api_url = api_url + 'v1/ca/client/'+this.clientId+'/services?api_token=' + token ;
    }



    api_url = api_url + "&page=" + page;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
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

  // For Add Client Contact
  editService(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/service/'+id, post_params, options)
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



  // For Deactive Service
  deactiveService(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id+'/deactivate-service', post_params, options)
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

  // For Deactive Service
  activeService(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id+'/activate-service', post_params, options)
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

  // For Client Contact Details
  getClientContactDetail(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientcontact/' + id + '/edit?api_token=' + api_token;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
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

}
