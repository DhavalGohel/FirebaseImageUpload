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

  // For Get Client  Listing
  getClientList(token?: string, search_text?: string, page?: number, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client?api_token=' + token;

    if (search_text != null && search_text != "") {
      api_url = api_url + "&search=" + search_text.trim();
    }

    if (page != null) {
      api_url = api_url + "&page=" + page;
    }

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
            try {
              resolve(err.json());
            } catch (e) {
              reject(err);
            }
          }
        });
    });
  }

  getClientCreateData(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/create?api_token=' + token;

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
  addClient(post_params?: any, postClient?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    let numbers = {};

    if (postClient != null && postClient.length > 0) {
      for (var i = 0; i < postClient.length; i++) {
        numbers[postClient[i].id] = postClient[i].value;
      }
    }

    post_params['numbers'] = numbers;

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client', post_params, options)
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

  // For SMS and Email Notification
  changeSMSandEmailNotfication(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id + '/change-notification', post_params, options)
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

  // For Login Notification
  changeLoginNotfication(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id + '/change-login', post_params, options)
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



  // For Edit and Delete Client Contact
  actionClient(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id, post_params, options)
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
  // For generate Password
  generatePassword(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v2/ca/client/' + id + '/generate-password?api_token=' + api_token;

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

  // For Client Contact Details
  getClientDetail(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/' + id + '/info?api_token=' + api_token;

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

  // For Client Edit Details
  getClientEditData(id?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/client/' + id + '/edit?api_token=' + api_token;

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
  editClient(id?: string, post_params?: any, postClient?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    let numbers = {};

    if (postClient != null && postClient.length > 0) {
      for (var i = 0; i < postClient.length; i++) {
        numbers[postClient[i].id] = postClient[i].value;
      }
    }

    post_params['numbers'] = numbers;

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/client/' + id, post_params, options)
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
