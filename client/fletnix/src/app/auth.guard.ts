import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ContextService } from './context.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private contextService: ContextService, private router: Router) {}

  canActivate(): boolean {
    const userContext = this.contextService.getContext();
    if (!userContext || !userContext.isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    if (userContext.isAuthenticated && !userContext.profileId) {
      this.router.navigate(['/profile-selection']);
      return false;
    }
    return true;
  }
}
