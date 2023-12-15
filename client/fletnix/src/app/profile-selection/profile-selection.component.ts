import { Component, OnInit } from '@angular/core';
import { ContextService } from '../context.service';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-selection',
  templateUrl: './profile-selection.component.html',
  styleUrls: ['./profile-selection.component.scss']
})
export class ProfileSelectionComponent implements OnInit {
  profiles: any[] = [];
  showAddProfileForm: boolean = false; 

  constructor(
    private contextService: ContextService,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar 
    ) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    const userContext = this.contextService.getContext();
    if (userContext && userContext.profiles) {
      this.profiles = userContext.profiles;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }

  selectProfile(profileId: string) {
    this.contextService.setProfileId(profileId);
    this.router.navigate(['/']);
  }

  convertToNumber(value: string): number {
    return Number(value);
  }

  addProfile(name: string, age: number): void {
    if (this.profiles.length >= 4) {
      alert('Maximum of 4 profiles allowed');
      return;
    }

    
    this.apiService.addProfile({ name, age }).subscribe(response  => {
      const updatedProfiles = response.profiles;
      this.profiles = updatedProfiles;
      this.showAddProfileForm = false; 

      const userContext = this.contextService.getContext();
      userContext.profiles = updatedProfiles;
      this.contextService.setContext(userContext);
  
    }, error => {
      this.openSnackBar('Something Went wrong! Please try again later', 'Close');
      console.error('Error adding profile:', error);
    });
  }

  toggleAddProfileForm(): void {
    this.showAddProfileForm = !this.showAddProfileForm;
  }
}
