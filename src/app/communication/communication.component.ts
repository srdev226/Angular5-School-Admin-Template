import { Component, OnInit, Inject, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SchoolDataService } from '../management/school/school-data.service';
import { Notification, DeliveryChannel } from '../notification/notification';
import { NotificationService } from '../notification/notification.service';
import { Messaging} from '../messaging/messaging';
import { MessagingService } from '../messaging/messaging.service';
import * as moment from 'moment';


@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  SMS_MAX_LENGTH = 420;

  private _contactList: any[];

  @Output()
  onSent = new EventEmitter<string>();

  smsText: string;
  showList: boolean = false;
  contactCount: number;
  notificationCount: number;
  notificationSetupUnavailableCount: number;
  verifiedNotificationCount: number;
  messaging: Messaging[];

  uiStatusMap = new Map();

  constructor(private router: Router,
              private schoolDataService: SchoolDataService,
              private messagingService: MessagingService,
              private notificationService: NotificationService
            ) { }

  ngOnInit() {
    this.contactCount = this._contactList.length;
    this.notificationCount = this._contactList.filter(x => (x.notification_mobile_numbers && x.notification_mobile_numbers[0])).length;
    this.notificationSetupUnavailableCount = this.contactCount - this.notificationCount;
    this.verifiedNotificationCount = this._contactList.filter(x => (x.notification_mobile_numbers &&
      x.notification_mobile_numbers[0] && x.notification_mobile_numbers[0].is_verified)).length;
    this.setUIStatusMap();
  }

  @Input()
  set contactList(contactList){
    this._contactList = contactList;
  }

  get contactList(){
    return this._contactList;
  }

  private setUIStatusMap(){
    for (let contact of this._contactList){
      if(!this.uiStatusMap.get(contact.contact_key)){
        let ui_status = {
          'key': contact.contact_key,
          'selected': false,
          'disabled': true
        }
        if( contact.notification_mobile_numbers && contact.notification_mobile_numbers.length > 0){
          ui_status.disabled = false;
          ui_status.selected = true;
        }
        this.uiStatusMap.set(contact.contact_key, ui_status);
      }
    }
  }

  public getUnSelectedContactCount(){
    return (this.contactCount - (this.notificationCount + this.notificationSetupUnavailableCount));
  }

  public selectUnSelectContact(contact){
    this.uiStatusMap.get(contact.contact_key).selected = !this.uiStatusMap.get(contact.contact_key).selected
    this.notificationCount = this._contactList.filter(x =>
      (x.notification_mobile_numbers && x.notification_mobile_numbers[0] && this.isSelected(x)))
      .length;
  }

  public isSelected(contact){
    return this.uiStatusMap.get(contact.contact_key).selected;
  }

  private getFormattedSchoolName(school_name){
    school_name = school_name.length > 27 ? school_name.substring(0,27) : school_name;
    return "[" + school_name + "] ";
  }

  sendSMS() {
    this.sendMessage();
    if (this._contactList.length > 0) {
      let to_identifiers: string[] = [];
      for (let contact of this._contactList) {
        if (this.isSelected(contact)) {
          let contact_no = contact.notification_mobile_numbers[0];
          let country_code = contact_no.country_code ? contact_no.country_code : "91";
          let mobile = contact_no.phone_number;
          to_identifiers.push(country_code + mobile);
        }
      }
      let msg = this.getFormattedSchoolName(this.schoolDataService.getSchool().name) + this.smsText;
      if(to_identifiers.length>0){
        this.notificationService.sendGroupSMSMessage(msg, to_identifiers).then(resp => {
          if(resp.notification_key){
            this.smsText = "";
            this.onSent.emit('success');
          }
          else{
            this.onSent.emit('failed');
          }
        }).catch( x => {
            console.error('[CommunicationComponent] sms sending failed');
            this.onSent.emit('failed');
        });
      }else{
        console.warn('[CommunicationComponent] Notification number is not provided, sms not sent');
        this.onSent.emit('cancelled');
      }
    }
  }

  sendMessage() {
    if (this._contactList.length > 0) {
      let _Msg : Messaging[] = []
      let messaging = new Messaging()
        for (let contact of this._contactList) {
          if (this.isSelected(contact)) {
          messaging.title = "General Notification";
          messaging.time_stamp = moment().format();
          messaging.message = this.smsText;
          messaging.sender_key = this.schoolDataService.getSchool().school_id;
          messaging.sender_type = "SCHOOL";
          messaging.receiver_key = contact.contact_key;
          messaging.receiver_type = "STUDENT";
          messaging.thread_key = "thread_key";
          _Msg.push(messaging)
        }
      }
      if(_Msg.length>0){
        this.messagingService.addGroupMessage(_Msg).then(resp => {
          if(resp.keys){
            for(let message_key of resp.keys){
              messaging.message_key = message_key;
              _Msg.push(messaging)
             }
             this.messaging = _Msg;
             console.log("message", JSON.stringify(this.messaging));
             this.smsText = "";
            console.log('[CommunicationComponent] message successfully send');
          }
        }).catch( x => {
            console.error('[CommunicationComponent] sms sending failed');
        });
      }else{
        console.warn('[CommunicationComponent] Notification number is not provided, message not sent');
      }
    }
  }

  back() {
    this.onSent.emit('cancelled');
  }
}
