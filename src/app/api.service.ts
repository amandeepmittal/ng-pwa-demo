import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private dataURL: string = 'https://api.hnpwa.com/v0/news/1.json';

  constructor(private httpClient: HttpClient) {}

  getData(): Observable<Item[]> {
    return <Observable<Item[]>>this.httpClient.get(this.dataURL);
  }
}
