import { Component, OnInit  } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router'; 
import { ContextService } from '../context.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData = { email: 'kartik@email.com', password: 'kartikishappy' };

  constructor(
    private apiService: ApiService, 
    private contextService: ContextService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
      this.checkAuthentication();
    }

    checkAuthentication() {
      const userContext = this.contextService.getContext();
      if (userContext.isAuthenticated) {
        this.openSnackBar('Already Authenticated', 'Close');
        this.router.navigate(['/']);
      }
    }

    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000, 
      });
    }

  onLogin(event: Event) {
    event.preventDefault();
    this.apiService.loginUser(this.loginData).subscribe({
      next: (response) => {
        const { token, user } = response;
        const { createdAt, updatedAt, __v, ...userData } = user;
        this.contextService.setContext({
          ...userData,
          isAuthenticated: true,
          token: token 
        });
        this.openSnackBar('Success! Login in now', 'Close');
       this.router.navigate(['/profile-selection']);
      },
      error: (error) => {
        this.openSnackBar('Something Went wrong! Please try again later', 'Close');
        console.error('Login Error:', error);
      }
    });
  }
}
