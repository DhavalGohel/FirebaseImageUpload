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
  addTask(post_params?: any, options?: RequestOptions){
    if (!options) {
      options = new RequestOptions();
    }
    console.log(post_params);
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
  actionTask(id?: string, post_params?: any, options?: RequestOptions){
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

}
