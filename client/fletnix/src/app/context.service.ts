import { Injectable } from '@angular/core';

interface UserContext {
  name: string | null;
  email: string | null;
  age: number | null;
  role: string | null;
  profiles: any[];
  isAuthenticated: boolean;
  profileId: string | null;
  token: string | null; 
}


@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private context: UserContext = {
    name: null,
    email: null,
    age: null,
    role: null,
    profiles: [],
    isAuthenticated: false,
    profileId: null,
    token: null
  };

  getContext(): UserContext {
    const storedContext = localStorage.getItem('userContext');
    if (storedContext) {
      this.context = JSON.parse(storedContext);
    }
    return this.context;
  }
  

  setContext(userData: UserContext) {
    this.context = { ...this.context, ...userData };
    localStorage.setItem('userContext', JSON.stringify(this.context));
  }
  setProfileId(profileId: string) {
    this.context = { ...this.context, profileId };
    localStorage.setItem('userContext', JSON.stringify(this.context));
  }

  clearContext() {
    this.context = {
      name: null,
      email: null,
      age: null,
      role: null,
      profiles: [],
      isAuthenticated: false,
      profileId: null,
      token: null
    };
    localStorage.removeItem('userContext');
  }
}
