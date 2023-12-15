import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ContextService } from '../context.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  user = { name: '', email: '', password:'', age: null };
  isLoading = false;

  constructor(private apiService: ApiService, 
    private contextService: ContextService,  
    private router: Router, 
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }

  checkAuthentication() {
    const userContext = this.contextService.getContext();
    if (userContext.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.isLoading = true;
    this.apiService.registerUser(this.user).subscribe({
      next: (response) => {
        const { token, user } = response;
        const { createdAt, updatedAt, __v, ...userData } = user;
        this.contextService.setContext({
          ...userData,
          isAuthenticated: true,
          token: token 
        });
        this.isLoading = false;
      this.openSnackBar('Success! Login in now', 'Close');
       this.router.navigate(['/profile-selection']);
      },
      error: (error) => {
        this.isLoading = false;
        this.openSnackBar('Something Went wrong! Please try again later', 'Close');
        console.error('Error:', error);
      }
    });
  }
}