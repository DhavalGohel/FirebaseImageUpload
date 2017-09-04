
import { Injectable } from '@angular/core';
import { Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class InvoiceService {

  constructor(
    public http: Http,
    public appConfig: AppConfig) {
  }

  // For Get Invoice Listing
  getInvoiceListData(token?: string, page?: number, search_text?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices?api_token=' + token + '&page=' + page;

    if (search_text != null && search_text != "") {
      api_url = api_url + "&search=" + search_text.trim();
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
            reject(err);
          }
        });
    });
  }

  // Delete Invoice
  deleteInvoice(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientinvoices/' + id, post_params, options)
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

  // Cancel Invoice
  cancelInvoice(token?: string, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices/cancel/' + employee_id + '?api_token=' + token;

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

  // uncancel Invoice
  uncancelInvoice(token?: string, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices/uncancel/' + employee_id + '?api_token=' + token;

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

  // Add Invoice
  addInvoiceData(param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices';

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(api_url, param, options)
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

  // Edit Invoice
  editInvoiceData(param?: any, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices/' + employee_id;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(api_url, param, options)
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

  // Get add Invoice Dropdown
  getCreateData(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices/create?api_token=' + token;

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

  // Get Client Invoice Data
  getClientInvoiceData(token?: string, clientId?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices/service_list/49?api_token=' + token;

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

  // Get Edit Dropdown / Invoice Detail
  getInvoiceDetail(token?: string, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientinvoices/' + employee_id + '/edit?api_token=' + token;

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
