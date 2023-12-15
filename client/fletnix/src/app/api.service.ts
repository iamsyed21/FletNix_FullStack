import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContextService } from './context.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private contextService: ContextService, private router: Router) { }

  registerUser(userData: any) {
    return this.http.post<any>('https://fletnix-api-nap0.onrender.com/api/signup', userData);
  }

  loginUser(userData: any) {
    return this.http.post<any>('https://fletnix-api-nap0.onrender.com/api/auth/login', userData);
  }

  getCategories(contentType: string): Observable<string[]> {
    const token = this.contextService.getContext().token;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<string[]>(`https://fletnix-api-nap0.onrender.com/api/content/categories`, { 
      headers: headers,
      params: new HttpParams().set('type', contentType)
    });
  }

  getContent(profileId: string, page: number, type?: string, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('profileId', profileId)
      .set('limit', '15')
      .set('page', page.toString());
  
    if (type) {
      params = params.set('type', type);
    }
  
    if (category) {
      params = params.set('category', category);
    }
  
    const token = this.contextService.getContext().token;
  
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get<{ name: string }[]>(`https://fletnix-api-nap0.onrender.com/api/content/getContent`, { headers, params });
    } else {
      console.error('No authentication token found');
      this.router.navigate(['/login']);
      // Observable needs to be returned from all code paths, so we return an Observable that immediately errors out.
      return new Observable(subscriber => {
        subscriber.error(new Error('No authentication token found'));
      });
    }
  }
  

  searchContent(profileId: string, searchQuery: string, page: number): Observable<any> {
    const params = new HttpParams()
      .set('profileId', profileId)
      .set('search', searchQuery)
      .set('limit', '15')
      .set('page', page.toString());
  
    const token = this.contextService.getContext().token;
  
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get<{ title: string }[]>(`https://fletnix-api-nap0.onrender.com/api/content/search`, { headers, params });
    } else {
      console.error('No authentication token found');
      this.router.navigate(['/login']);
      return new Observable(subscriber => {
        subscriber.error(new Error('No authentication token found'));
      });
    }
  }

  addProfile(profileData: { name: string; age: number }): Observable<any> {
    const token = this.contextService.getContext().token;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`https://fletnix-api-nap0.onrender.com/api/profile`, profileData, { headers });
  
  }

  pingServer(): Observable<string> {
    return this.http.get<string>('https://fletnix-api-nap0.onrender.com/ping', { responseType: 'text' as 'json' });
  }
  
}
