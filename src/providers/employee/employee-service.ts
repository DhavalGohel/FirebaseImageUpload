import { Injectable } from '@angular/core';
import { Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class EmployeeService {

  constructor(public http: Http,
    public appConfig: AppConfig) {

  }

  //http://dev.onzup.com/api/v1/ca/employees?api_token=MHuhGKIfJ1syb4jnUiZsWFONHLcN02xrGg1k8OjLD49b8Mbwf0n748IiCVSh&page=1

  // For Delete Employee
  deleteEmployee(id?: string, post_params?: any, options?: RequestOptions){
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/employees/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Get Employee Listing
  getEmployeeListData(token?: string, page?: number, search_text?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees?api_token=' + token + '&page=' + page;

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


  getEmployeeDetail(token?: string, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/' + employee_id + '/edit?api_token=' + token;

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


  generatePassword(employee_id: string,param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/' + employee_id + '/generate-password';

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(api_url, param,options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  getEmployeeAllDD(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/create?api_token=' + token;

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

  addEmployeeData(param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees';

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(api_url, param,options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  editEmployeeData(param?: any,employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/'+employee_id;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(api_url, param,options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }
}
