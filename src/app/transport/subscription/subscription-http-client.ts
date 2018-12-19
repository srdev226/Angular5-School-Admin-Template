import {Injectable} from '@angular/core';
import { Headers} from '@angular/http';

import {environment} from '../../../environments/environment';
import { AppHttpClient } from '../../security/app-http-client';

@Injectable()
export class SubscriptionHttpClient extends AppHttpClient{

  createAuthorizationHeader(headers: Headers) {
    let username : string = environment.subscriptionws_securityUser;
    let password : string = environment.subscriptionws_securityPassword;

    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    headers.append("Content-Type", "application/json");
  }


}
