import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class ClientService {

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) {
  }

  // For Get Client Group Listing
  getClientDropDown(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/create?api_token=' + token;

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

  // For Get Client  Listing
  getClientList(token?: string, search_text?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client?api_token=' + token;

    if (search_text != null && search_text != "") {
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

  getClientCreateData(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/create?api_token=' + token;

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
  addClient(post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For SMS and Email Notification
  changeSMSandEmailNotfication(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id + 'change-notification', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Login Notification
  changeLoginNotfication(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id + 'change-login', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }



  // For Edit and Delete Client Contact
  actionClient(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }
  // For generate Password
  generatePassword(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v2/ca/client/' + id + '/generate-password?api_token=' + api_token;

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

  // For Client Contact Details
  getClientDetail(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/' + id + '/info?api_token=' + api_token;

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

  // For Client Edit Details
  getClientEditData(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/' + id + '/edit?api_token=' + api_token;

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


  getModuleDropDown(token?: string, module?: string, param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/' + module + '?api_token=' + token;

    if (!options) {
      options = new RequestOptions();
    }

    if (param != null && Object.keys(param).length > 0) {
      for (var i in param) {
        api_url += "&" + i + "=" + param[i];
      }
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
