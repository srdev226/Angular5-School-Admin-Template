import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';

import {environment} from '../../../../environments/environment';
import { AppHttpClient } from '../../../security/app-http-client';

@Injectable()
export class FeeReceiptHttpClient extends AppHttpClient{

  createAuthorizationHeader(headers: Headers) {
    let username : string = environment.receiptws_securityUser;
    let password : string = environment.receiptws_securityPassword;

    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    headers.append("Content-Type", "application/json");
  }

}
