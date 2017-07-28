import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

import { getHeaders } from '../utils/utils';

@Injectable()
export class BucketListsService {
  public token: string;
  public headers: Headers;

  private url: string = 'http://127.0.0.1:5000/api/v1/bucketlists';

  constructor(private http: Http) {
    // set token if saved in local storage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.headers = getHeaders();
    this.headers.set('Authorization', `Bearer ${this.token}`);
  }

  public getBucketLists() {
    return this.http.get(this.url, { headers: this.headers })
      .map((response) => response.json());
  }

  public searchBucketLists(query) {
    return this.http.get(this.getSearchUrl(query), { headers: this.headers })
      .map((response) => response.json());
  }

  public getBucketList(id) {
    return this.http.get(this.getBucketListUrl(id), { headers: this.headers })
      .map((response) => response.json());
  }

  public addBucketList(bucketList) {
    return this.http.post(
      this.url, JSON.stringify(bucketList),
      { headers: this.headers }
    )
      .map((response) => response.json());
  }

  public updateBucketList(bucketList) {
    return this.http.put(
      this.getBucketListUrl(bucketList.id),
      JSON.stringify(bucketList), { headers: this.headers }
    )
      .map((response) => response.json());
  }

  public deleteBucketList(id) {
    return this.http.delete(this.getBucketListUrl(id),
      { headers: this.headers }
    )
      .map((response) => response.json());
  }

  private getBucketListUrl(id) {
    return this.url + '/' + id;
  }

  private getSearchUrl(query) {
    return this.url + '?q=' + query;
  }
}
