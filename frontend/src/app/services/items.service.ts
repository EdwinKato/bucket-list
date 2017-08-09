import {
	Injectable
} from '@angular/core';
import {
	Http,
	Headers
} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import {
	getHeaders
} from '../utils/utils';
import {
	API_URL
} from '../utils/utils';

@Injectable()
export class ItemsService {
	public token: string;
	public headers: Headers;

	private url: string = API_URL + 'bucketlists';

	constructor(private http: Http) {
		// set token if saved in local storage
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = currentUser && currentUser.token;
		this.headers = getHeaders();
		this.headers.set('Authorization', `Bearer ${this.token}`);
	}

	public getItems(bucketListId, start, limit, url ?: string) {
		let paginatedUrl = this.getBucketListUrl(bucketListId)
			+ '?start=' + start + '&limit=' + limit;
		if (url) {
			paginatedUrl = url;
		}

		return this.http.get(paginatedUrl, {
				headers: this.headers
			})
			.map((response) => response.json());
	}

	public searchItems(id, query) {
		return this.http.get(this.getSearchUrl(id, query), {
				headers: this.headers
			})
			.map((response) => response.json());
	}

	public getItem(bucketListId, itemId) {
		return this.http.get(this.getItemUrl(bucketListId, itemId), {
				headers: this.headers
			})
			.map((response) => response.json());
	}

	public addItem(bucketListId, item) {
		return this.http.post(
				this.getBucketListUrl(bucketListId),
				JSON.stringify(item), {
					headers: this.headers
				}
			)
			.map((response) => response.json());
	}

	public updateItem(bucketListId, item) {
		return this.http.put(
				this.getItemUrl(bucketListId, item.id),
				JSON.stringify(item), {
					headers: this.headers
				}
			)
			.map((response) => response.json());
	}

	public deleteItem(bucketListId, itemId) {
		return this.http.delete(this.getItemUrl(bucketListId, itemId), {
				headers: this.headers
			})
			.map((response) => response.json());
	}

	public getBucketListUrl(id) {
		return this.url + '/' + id + '/items';
	}

	private getItemUrl(id, itemId) {
		return this.getBucketListUrl(id) + '/' + itemId;
	}

	private getSearchUrl(id, query) {
		return this.getBucketListUrl(id) + '?q=' + query;
	}
}
