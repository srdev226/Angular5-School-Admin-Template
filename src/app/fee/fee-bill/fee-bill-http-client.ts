import {Injectable} from '@angular/core';
import { Headers} from '@angular/http';

import {environment} from '../../../environments/environment';
import { AppHttpClient } from '../../security/app-http-client';

@Injectable()
export class FeeBillHttpClient extends AppHttpClient{

  createAuthorizationHeader(headers: Headers) {
    let username : string = environment.feebillws_securityUser;
    let password : string = environment.feebillws_securityPassword;

    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    headers.append("Content-Type", "application/json");
  }

}
