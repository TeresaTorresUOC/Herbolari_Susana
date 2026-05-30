import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'https://herbolari-susana.onrender.com/login';
  private registerUrl = 'https://herbolari-susana.onrender.com/register';

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: LoginData): Observable<any> {
    return this.http.post(this.loginUrl, data).pipe(
      tap((response: any) => {
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(this.registerUrl, data);
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private getUserFromStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}