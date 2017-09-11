import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class ExpensesService {

  constructor(
    public http: Http,
    public appConfig: AppConfig) {
  }

  // Get Expense Listing
  getExpenseList(token?: string, search_text?: string, page?: number, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientexpenses?api_token=' + token;

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

  // For Edit and Delete Expense
  actionExpense(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientexpenses/' + id, post_params, options)
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

  getCreateData(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientreceipts/create?api_token=' + token;

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

  getEditData(id?: string, token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientreceipts/' + id + '/edit?api_token=' + token;

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

  getClientInvoiceList(id?: string, token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/clientreceipts/get-client-invoices/' + id + '?api_token=' + token;

    /*
    let headers = new Headers();
    headers.set('X-Requested-With', 'XMLHttpRequest');

    options = new RequestOptions({
      headers: headers
    });
    */

    let post_params = null;

    return new Promise((resolve, reject) => {
      this.http.post(api_url, post_params, options)
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

  // For Add Receipt
  addReceipt(post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    let pending_invoices = [];
    let pending_expenses = [];

    if (post_params != null) {
      if (post_params.mInvoiceList && post_params.mInvoiceList.length > 0) {
        for (let i = 0; i < post_params.mInvoiceList.length; i++) {
          let element = {
            'account_client_invoices_id': post_params.mInvoiceList[i].account_client_invoices_id,
            'amount': post_params.mInvoiceList[i].amount,
            'pending_amount': post_params.mInvoiceList[i].pending_amount
          }

          pending_invoices.push(element);
        }
      }

      if (post_params.mExpenseList != null && post_params.mExpenseList.length > 0) {
        for (let i = 0; i < post_params.mExpenseList.length; i++) {
          let element = {
            'account_client_invoices_id': post_params.mExpenseList[i].account_client_invoices_id,
            'account_client_invoices_expense_detail_id': post_params.mExpenseList[i].account_client_invoices_expense_detail_id,
            'amount': post_params.mExpenseList[i].amount,
            'pending_amount': post_params.mExpenseList[i].pending_amount,
          };

          pending_expenses.push(element);
        }
      }
    }

    post_params['pending_invoices'] = pending_invoices;
    post_params['pending_expenses'] = pending_expenses;

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientreceipts', post_params, options)
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

  editReceipt(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    let pending_invoices = [];
    let pending_expenses = [];

    if (post_params != null) {
      if (post_params.mInvoiceList && post_params.mInvoiceList.length > 0) {
        for (let i = 0; i < post_params.mInvoiceList.length; i++) {
          let element = {
            'id': post_params.mInvoiceList[i].id,
            'pending_amount': post_params.mInvoiceList[i].pending_amount,
            'amount': post_params.mInvoiceList[i].amount,
            'pre_amount': post_params.mInvoiceList[i].pre_amount
          }

          pending_invoices.push(element);
        }
      }

      if (post_params.mExpenseList != null && post_params.mExpenseList.length > 0) {
        for (let i = 0; i < post_params.mExpenseList.length; i++) {
          let element = {
            'id': post_params.mExpenseList[i].id,
            'pending_amount': post_params.mExpenseList[i].pending_amount,
            'amount': post_params.mExpenseList[i].amount,
            'pre_amount': post_params.mExpenseList[i].pre_amount
          };

          pending_expenses.push(element);
        }
      }
    }

    post_params['pending_invoices'] = pending_invoices;
    post_params['pending_expenses'] = pending_expenses;

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/clientreceipts/' + id, post_params, options)
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
