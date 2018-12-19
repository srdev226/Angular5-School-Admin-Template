import 'rxjs/add/operator/toPromise';

import {Injectable} from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';
import { AppHttpClient } from '../security/app-http-client';

import {PersonInfo} from './person';
import {PersonResponse} from './person-response';

@Injectable()
export class PersonService {

  private personUrl = environment.personServiceUrl;
  private fileManagementServiceUrl = environment.fileManagementServiceUrl;


  constructor(private http: AppHttpClient) {}

  addPerson(person: PersonInfo): Promise<PersonResponse> {

    let data = JSON.stringify(person);

    return this.http.put(this.personUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updatePerson(person: PersonInfo): Promise<PersonResponse> {

    let data = JSON.stringify(person);

    return this.http.post(this.personUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getPerson(person_key: String): Promise<PersonInfo> {

    let url = this.personUrl + "/" + person_key;
    return this.http.get(url)
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

    getProfilePicture(profile_image_key: string): Promise<any> {
    let url : string = this.fileManagementServiceUrl+'/downloadfile/'+profile_image_key;

    return this.http.get(url)
    .toPromise()
    .catch(this.handleError);
  }


}
