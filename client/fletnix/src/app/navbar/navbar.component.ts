import { Component, OnInit, HostListener } from '@angular/core';
import { ContextService } from '../context.service'; // Adjust the path as necessary
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  profileName: string | null = null;
  isLargeScreen: boolean = true;

  constructor(private contextService: ContextService, private router: Router) { 
    this.updateScreenSize();
  }

  ngOnInit(): void {
    this.loadProfileName();
  }

  loadProfileName(): void {
    const userContext = this.contextService.getContext();
    if (userContext && userContext.profiles && userContext.profileId) {
      const selectedProfile = userContext.profiles.find(profile => profile._id === userContext.profileId);
      this.profileName = selectedProfile ? selectedProfile.profileName : null;
    }
  }

  logout(): void {
    this.contextService.clearContext();
    localStorage.removeItem('userContext'); 
    this.router.navigate(['/login']); 
  }

  updateScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateScreenSize();
  }
}
