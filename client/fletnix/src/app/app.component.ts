import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fletnix';

  showNavbar: boolean = true;

  constructor(private router: Router, private apiService: ApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register', '/profile-selection'].includes(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.apiService.pingServer().subscribe({
      next: (response) => {
        console.log(response); // Log the response from the server
      },
      error: (error) => {
        console.error('Error pinging server:', error);
      }
    });
  }

}
