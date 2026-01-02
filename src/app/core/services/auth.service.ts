import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly ROLE_KEY = 'userRole';
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Register a new user
   * @param name User name
   * @param email User email
   * @param password User password
   * @param role User role
   * @returns Observable<AuthResponse>
   */
  register(name: string, email: string, password: string, role: string = 'User'): Observable<AuthResponse> {
    const registerRequest: RegisterRequest = { name, email, password, role };

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerRequest).pipe(
      tap((response: AuthResponse) => {
        // Store token and role in localStorage
        this.setToken(response.token);
        this.setRole(response.role);
        this.authStatusSubject.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   * @returns Observable<AuthResponse>
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginRequest).pipe(
      tap((response: AuthResponse) => {
        // Store token and role in localStorage
        this.setToken(response.token);
        this.setRole(response.role);
        this.authStatusSubject.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user - clears token and role from localStorage
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.authStatusSubject.next(false);
  }

  /**
   * Get stored authentication token
   * @returns Token string or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   * @returns true if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined && token !== '';
  }

  /**
   * Get user role from localStorage
   * @returns Role string or null if not found
   */
  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  /**
   * Set authentication token in localStorage
   * @param token JWT token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Set user role in localStorage
   * @param role User role
   */
  private setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid email or password';
          // Clear any existing auth data on 401
          this.logout();
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Authentication endpoint not found';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error('AuthService Error:', errorMessage);
  }
}

