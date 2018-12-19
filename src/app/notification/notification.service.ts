import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Notification, Message, DeliveryChannel } from './notification';
import { environment } from '../../environments/environment';
import { AppHttpClient } from '../security/app-http-client';


@Injectable()
export class NotificationService {

  private notificationUrl = environment.notificationServiceUrl;

  constructor(private http: AppHttpClient) { }

  sendSMSMessage(message: string, to_identifier: string): Promise<any>{
    let notification = new Notification();
    notification.message = new Message();
    notification.message.text = message;
    let delivery_channel = new DeliveryChannel();
    delivery_channel.type = "sms";
    delivery_channel.to_identifier = to_identifier;
    delivery_channel.status = "pending";
    notification.delivery_channels.push(delivery_channel);

    return this.sendNotification(notification);
  }

  sendGroupSMSMessage(message: string, to_identifiers: string[]): Promise<any>{
    let notification = new Notification();
    notification.message = new Message();
    notification.message.text = message;
    for(let to_identifier of to_identifiers){
      let delivery_channel = new DeliveryChannel();
      delivery_channel.type = "sms";
      delivery_channel.to_identifier = to_identifier;
      delivery_channel.status = "pending";
      notification.delivery_channels.push(delivery_channel);
    }

    return this.sendNotification(notification);
  }

  sendNotification(notification: Notification): Promise<any> {
    notification.partner_key = environment.partnerKey;
    // let headers = new Headers({'Content-Type' : 'application/json'});
    // let options = new RequestOptions({headers : headers});
    let data = JSON.stringify(notification);

    return this.http.put(this.notificationUrl, data)
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
