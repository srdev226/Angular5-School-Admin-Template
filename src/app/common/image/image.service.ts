import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';

import {environment} from '../../../environments/environment';

@Injectable()
export class ImageService {

  private fileManagementServiceUrl = environment.fileManagementServiceUrl;

  constructor(private http: Http) { }

  saveProfilePicture(image : File): Promise<any> {

    let url : string = this.fileManagementServiceUrl+'/uploadfile';
    // let headers = new Headers();
    //
    // let options = new RequestOptions({headers : headers});

    // let data = JSON.stringify(image);
    let formData = new FormData();
    formData.append('file',image);

    return this.http.post(url, formData)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log("[PersonService] JSON : ", body);
    // return body;
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
