import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  hits: [];
  title: string;
  url: string;
  author: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private dataURL: string = 'http://hn.algolia.com/api/v1/search_by_date?tags=story';

  constructor(private httpClient: HttpClient) {}

  fetch(): Observable<Item[]> {
    return <Observable<Item[]>this.httpClient.get(this.dataURL);
  }
}
