import {
	Headers
} from '@angular/http';

export function getHeaders() {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Access-Control-Allow-Origin', '*');
	return headers;
}

export const API_URL = 'https://yobucketlist.herokuapp.com/api/v1/';
