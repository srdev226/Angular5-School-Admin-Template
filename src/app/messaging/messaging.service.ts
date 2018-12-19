import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Messaging} from './messaging';
import { environment } from '../../environments/environment';
import { MessagingHttpClient } from './messaging-http-client';
import * as moment from 'moment';


@Injectable()
export class MessagingService {

  private messagingUrl = environment.messagingServiceUrl;

  constructor(private http: MessagingHttpClient) { }

  addMessage(messaging: Messaging): Promise<any> {
    let data = JSON.stringify(messaging);

    return this.http.put(this.messagingUrl, data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  }

  addGroupMessage(messaging: Messaging[]): Promise<any> {
    let data = JSON.stringify(messaging);
    let url = this.messagingUrl + "/batch/messages";

    return this.http.put(url, data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    let message : any = "";
    if (error.status === 400 || error.status === "400" ) {
      message = Observable.name;
    }
    else {
      message = Observable.throw(new Error(error.status));
    }
    return message;
  }

}
