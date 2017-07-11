import { Injectable } from '@angular/core';
import { Http , RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { AppConfig } from '../AppConfig';

@Injectable()
export class EmployeeService {

  constructor(public http: Http,
  public appConfig: AppConfig) {

  }

  //http://dev.onzup.com/api/v1/ca/employees?api_token=MHuhGKIfJ1syb4jnUiZsWFONHLcN02xrGg1k8OjLD49b8Mbwf0n748IiCVSh&page=1

  // For Get Employee Listing
  getEmployeeListData(token?: string, page?: number,search_text?: string, options?: RequestOptions) {
    let api_url = this.appConfig.API_URL + 'v1/ca/employees?api_token=' + token + '&page=' + page;

    if (search_text != null && search_text != ""){
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

}
