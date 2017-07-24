import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class TaskService {
  public taskSearch: any = {};
  public clientId: string = "";

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) { }

  getClientId() {
    return this.clientId;
  }

  setClientId(id) {
    this.clientId = id;
  }

  removeClientId() {
    this.clientId = '';
  }

  setTaskSearch(object){
    this.taskSearch = object;
  }

  clearTaskSearch() {
    this.taskSearch = {
      client_group_id: "0",
      client_id: "0",
      employee_id: "0",
      priority_id: "0",
      description: "",
      service_id: "0",
    };
  }

  getTaskCounterData(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/counter?api_token=' + token;

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
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  getTaskList(token?: string, status?: string, page?: number, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks?is=' + status + '&api_token=' + token + '&page=' + page;

    if (!options) {
      options = new RequestOptions();
    }

    if (this.taskSearch.client_group_id != null && this.taskSearch.client_group_id != "" && this.taskSearch.client_group_id != "0") {
      api_url += "&client_group_id="+this.taskSearch.client_group_id
    }

    if (this.taskSearch.client_id != null && this.taskSearch.client_id != "" && this.taskSearch.client_id != "0") {
      api_url += "&client_id="+this.taskSearch.client_id
    }

    if (this.taskSearch.employee_id != null && this.taskSearch.employee_id != "" && this.taskSearch.employee_id != "0") {
      api_url += "&employee_id="+this.taskSearch.employee_id
    }

    if (this.taskSearch.priority_id != null && this.taskSearch.priority_id != "" && this.taskSearch.priority_id != "0") {
      api_url += "&priority="+this.taskSearch.priority_id
    }

    if (this.taskSearch.service_id != null && this.taskSearch.service_id != "" && this.taskSearch.service_id != "0") {
      api_url += "&service_id="+this.taskSearch.service_id
    }

    if (this.taskSearch.description != null && this.taskSearch.description != "") {
      api_url += "&name="+this.taskSearch.description
    }

    if (this.clientId != null && this.clientId != "") {
      api_url += "&client_id=" + this.clientId;
    }

    // console.log(api_url);

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  deleteTask(task_id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks/' + task_id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  // For Get Task Dropdown
  getTaskDropDown(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/create?api_token=' + token;

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
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  // Change assign
  changeTaskAssignee(task_id?: string, assignee_id?: string, post_params?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/' + task_id + '/change-assignee/' + assignee_id;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(api_url, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  // For Add Task
  addTask(post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  // For Edit and Delete Task
  actionTask(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  // For reopen Task
  reopenTask(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks/re-open/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  // For Client Contact Details
  getTaskDetail(id?: string, status?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/' + id + '/edit?is=' + status + '&api_token=' + api_token;

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
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  getSearchDropDown(token?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(this.appConfig.API_URL + 'v1/ca/tasks/search-dropdowns?api_token=' + token, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  taskComplete(token?: string, post_params?: any, options?: RequestOptions){
    if (!options) {
      options = new RequestOptions();
    }

    let task_id = post_params.task_id;
    let task_client_service_id = post_params.task_client_service_id;
    let task_time = post_params.task_time;
    let task_comment = post_params.task_comment;

    let api_url = this.appConfig.API_URL + 'v2/ca/tasks/taskComplete/' + task_id + "/" + task_client_service_id + "?api_token=" + token;
    api_url += "&time=" + task_time + "&comment=" + task_comment;

    // let api_url = this.appConfig.API_URL + 'v2/ca/tasks/taskComplete/' + task_id + "/" + task_client_service_id + "?api_token=" + token;

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

  taskSpentTime(token?: string, post_params?: any, options?: RequestOptions){
    if (!options) {
      options = new RequestOptions();
    }

    let api_url = this.appConfig.API_URL + 'v2/ca/task/addspenttime?api_token=' + token;

    return new Promise((resolve, reject) => {
      this.http.post(api_url, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch(e) {
            reject(err);
          }
        });
    });
  }

}
