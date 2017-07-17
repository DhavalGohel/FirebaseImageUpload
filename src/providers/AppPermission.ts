import { Injectable } from '@angular/core';

import { AppConfig, AppMsgConfig } from '../providers/AppConfig';


@Injectable()
export class AppPermission {

  constructor(
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig) {

  }

}
