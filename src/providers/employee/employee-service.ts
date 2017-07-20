import { Injectable } from '@angular/core';
import { Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class EmployeeService {

  constructor(
    public http: Http,
    public appConfig: AppConfig) {
  }

  // For Delete Employee
  deleteEmployee(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/employees/' + id, post_params, options)
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

  // For Get Employee Listing
  getEmployeeListData(token?: string, page?: number, search_text?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees?api_token=' + token + '&page=' + page;

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


  getEmployeeDetail(token?: string, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/' + employee_id + '/edit?api_token=' + token;

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


  generatePassword(employee_id: string, param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/' + employee_id + '/generate-password';

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

  terminateEmployee(employee_id: string, token: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/' + employee_id + '/terminate?api_token=' + token;

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

  terminateEmployeeById(employee_id: string, param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/' + employee_id + '/terminate';

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


  getEmployeeAllDD(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees/create?api_token=' + token;

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

  addEmployeeData(param?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v2/ca/employees';

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

  editEmployeeData(param?: any, employee_id?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v2/ca/employees/' + employee_id;

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

}
