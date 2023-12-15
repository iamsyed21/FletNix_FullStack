import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  contentData: any;

  constructor(private sharedDataService: SharedDataService, private router: Router, private location: Location) {}

  ngOnInit() {
    this.contentData = this.sharedDataService.getContentData();
    console.log(this.contentData);

    
    if (!this.contentData || Object.keys(this.contentData).length === 0) {
      this.router.navigate(['/']); 
    }
  }

  goBack() {
    this.location.back();
  }
}
