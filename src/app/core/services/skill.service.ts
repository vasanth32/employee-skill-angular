import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SkillResponse, EmployeeSkillResponse, EmployeeSkillRateRequest } from '../../models/skill.models';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly API_URL = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) { }

  /**
   * Get all skills
   * @returns Observable<SkillResponse[]> - Array of skills
   */
  getAllSkills(): Observable<SkillResponse[]> {
    return this.http.get<SkillResponse[]>(this.API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, 'Failed to fetch skills');
      })
    );
  }

  /**
   * Create a new skill
   * @param skillName Name of the skill
   * @returns Observable<SkillResponse> - Created skill data
   */
  createSkill(skillName: string): Observable<SkillResponse> {
    const body = { skillName };
    return this.http.post<SkillResponse>(this.API_URL, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, 'Failed to create skill');
      })
    );
  }

  /**
   * Rate a skill for an employee
   * @param employeeId Employee ID
   * @param request Skill rating request
   * @returns Observable<EmployeeSkillResponse> - Updated employee skill
   */
  rateSkill(employeeId: string, request: EmployeeSkillRateRequest): Observable<EmployeeSkillResponse> {
    const url = `${this.API_URL}/employees/${employeeId}/skills`;
    return this.http.post<EmployeeSkillResponse>(url, request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, `Failed to rate skill for employee: ${employeeId}`);
      })
    );
  }

  /**
   * Search skills with optional filters
   * @param skill Optional skill name filter
   * @param rating Optional minimum rating filter
   * @returns Observable<EmployeeSkillResponse[]> - Array of matching employee skills
   */
  searchSkills(skill?: string, rating?: number): Observable<EmployeeSkillResponse[]> {
    let params = new HttpParams();

    if (skill) {
      params = params.set('skill', skill);
    }

    if (rating !== undefined && rating !== null) {
      params = params.set('rating', rating.toString());
    }

    const url = `${this.API_URL}/search`;
    return this.http.get<EmployeeSkillResponse[]>(url, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, 'Failed to search skills');
      })
    );
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   * @param defaultMessage Default error message
   * @returns Observable that throws an error
   */
  private handleError(error: HttpErrorResponse, defaultMessage: string): Observable<never> {
    let errorMessage = defaultMessage;

    if (error.error instanceof ErrorEvent) {
      // Client-side error (network, parsing, etc.)
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 404:
          // Check if it's an endpoint not found vs resource not found
          if (error.url && error.url.includes('/skills')) {
            errorMessage = 'Skills API endpoint not found. Please ensure the backend server is running.';
          } else {
            errorMessage = 'Skill or resource not found';
          }
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission to access this resource.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation error. Please check your input.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. The server is temporarily unavailable.';
          break;
        default:
          errorMessage = error.error?.message ||
            `API Error: ${error.status} - ${error.statusText || 'Unknown error'}`;
      }
    }

    console.error('SkillService Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error
    });

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      originalError: error
    }));
  }
}

