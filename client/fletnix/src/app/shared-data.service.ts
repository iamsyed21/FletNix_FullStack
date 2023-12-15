import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private contentData: any;

  setContentData(data: any) {
    this.contentData = data;
  }

  getContentData() {
    return this.contentData;
  }
}
