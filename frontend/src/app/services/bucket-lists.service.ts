import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

import { getHeaders } from '../utils/utils'

@Injectable()
export class BucketListsService {
  public token: string;
  public headers: Headers;

  // private url: string = "http://jsonplaceholder.typicode.com/users";

  private url: string = "http://127.0.0.1:5000/api/v1/bucketlists";

  constructor(private http: Http) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    // console.log("JWT " + this.token)
    this.headers = getHeaders();
    this.headers.set('Authorization', `Bearer ${this.token}`);
    // this.headers.append('Authorization', "JWT " + this.token);
  }

  getBucketLists(){
    return this.http.get(this.url, {headers: this.headers})
      .map(response => response.json());
  }

  getBucketList(id){
    return this.http.get(this.getBucketListUrl(id), {headers: this.headers})
      .map(response => response.json());
  }

  addBucketList(bucketList){
    return this.http.post(this.url, JSON.stringify(bucketList), {headers: this.headers})
      .map(response => response.json());
  }

  updateBucketList(bucketList){
    return this.http.put(this.getBucketListUrl(bucketList.id), JSON.stringify(bucketList), {headers: this.headers})
      .map(response => response.json());
  }

  deleteBucketList(id){
    return this.http.delete(this.getBucketListUrl(id), {headers: this.headers})
      .map(response => response.json());
  }

  private getBucketListUrl(id){
    return this.url + "/" + id;
  }
}
