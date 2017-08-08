import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

import { getHeaders } from '../utils/utils';

@Injectable()
export class ItemsService {
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

  public getItems(bucket_list_id, start, limit, url?: string) {
		let paginatedUrl = this.getBucketListUrl(bucket_list_id) + '?start=' + start + '&limit=' + limit;
		if (url) {
			paginatedUrl = url;
		}

    return this.http.get(paginatedUrl, { headers: this.headers })
      .map((response) => response.json());
  }

  public searchItems(id, query) {
    return this.http.get(this.getSearchUrl(id, query), { headers: this.headers })
      .map((response) => response.json());
  }

  public getItem(bucket_list_id, item_id) {
    return this.http.get(this.getItemUrl(bucket_list_id, item_id), { headers: this.headers })
      .map((response) => response.json());
  }

  public addItem(bucket_list_id, item) {
    return this.http.post(
      this.getBucketListUrl(bucket_list_id),
      JSON.stringify(item), { headers: this.headers }
    )
      .map((response) => response.json());
  }

  public updateItem(bucket_list_id, item) {
    return this.http.put(
      this.getItemUrl(bucket_list_id, item.id),
      JSON.stringify(item), { headers: this.headers }
    )
      .map((response) => response.json());
  }

  public deleteItem(bucket_list_id, item_id) {
    return this.http.delete(this.getItemUrl(bucket_list_id, item_id), { headers: this.headers })
      .map((response) => response.json());
  }

  public getBucketListUrl(id) {
    return this.url + '/' + id + '/items';
  }

  private getItemUrl(id, item_id) {
    return this.getBucketListUrl(id) + '/' + item_id;
  }

  private getSearchUrl(id, query) {
    return this.getBucketListUrl(id) + '?q=' + query;
  }
}
