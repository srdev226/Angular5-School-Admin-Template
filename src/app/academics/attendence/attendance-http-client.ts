import {Injectable} from '@angular/core';
import { Headers} from '@angular/http';

import {environment} from '../../../environments/environment';
import { AppHttpClient } from '../../security/app-http-client';

@Injectable()
export class AttendanceHttpClient extends AppHttpClient {

  createAuthorizationHeader(headers: Headers) {
    let username : string = environment.attendancews_securityUser;
    let password : string = environment.attendancews_securityPassword;

    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    headers.append("Content-Type", "application/json");
  }

}
