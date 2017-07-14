import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class TaskService {

  constructor(
    public http: Http,
    public appConfig: AppConfig
  ) { }

  getTaskCounterData(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/counter?api_token=' + token;

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

  getTaskList(token?: string, status?: string, page?: number, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks?is=' + status + '&api_token=' + token + '&page=' + page;

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

  deleteTask(task_id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks/' + task_id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Get Task Dropdown
  getTaskDropDown(token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/create?api_token=' + token;

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

  // Change assign
  changeTaskAssignee(task_id?: string, assignee_id?: string, post_params?: any, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/' + task_id + '/change-assignee/' + assignee_id;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(api_url, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Add Task
  addTask(post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks', post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Edit and Delete Task
  actionTask(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For reopen Task
  reopenTask(id?: string, post_params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.post(this.appConfig.API_URL + 'v1/ca/tasks/re-open/' + id, post_params, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
        });
    });
  }

  // For Client Contact Details
  getTaskDetail(id?: string, status?: string, api_token?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/tasks/' + id + '/edit?is=' + status + '&api_token=' + api_token;

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

  getSearchDropDown(token?: string, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise(resolve => {
      this.http.get(this.appConfig.API_URL + 'v1/ca/tasks/search-dropdowns?api_token=' + token, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          resolve(err.json());
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
