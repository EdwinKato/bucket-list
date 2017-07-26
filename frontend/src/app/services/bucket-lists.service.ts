import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import {Headers} from 'angular2/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BucketListsService {

  // private url: string = "http://jsonplaceholder.typicode.com/users";

  private url: string = "http://127.0.0.1:5000/api/v1/bucketlists?limit=10";

  constructor(private http: Http) { }

  getBucketLists(){
    return this.http.get(this.url)
      .map(res => res.json());
  }

  getBucketList(id){
    return this.http.get(this.getBucketListUrl(id))
      .map(res => res.json());
  }

  addBucketList(bucketList){
    return this.http.post(this.url, JSON.stringify(bucketList))
      .map(res => res.json());
  }

  updateBucketList(bucketList){
    return this.http.put(this.getBucketListUrl(bucketList.id), JSON.stringify(bucketList))
      .map(res => res.json());
  }

  deleteBucketList(id){
    return this.http.delete(this.getBucketListUrl(id))
      .map(res => res.json());
  }

  private getBucketListUrl(id){
    return this.url + "/" + id;
  }
}
