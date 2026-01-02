import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EmployeeApiResponse } from '../../models/employee.models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = `${environment.apiUrl}/employee`;

  constructor(private http: HttpClient) { }

  /**
   * Get all employees
   * @returns Observable<EmployeeApiResponse[]> - Array of employees
   */
  getAllEmployees(): Observable<EmployeeApiResponse[]> {
    return this.http.get<EmployeeApiResponse[]>(this.API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, 'Failed to fetch employees');
      })
    );
  }

  /**
   * Get employee by ID
   * @param id Employee ID
   * @returns Observable<EmployeeApiResponse> - Employee data
   */
  getEmployeeById(id: string): Observable<EmployeeApiResponse> {
    return this.http.get<EmployeeApiResponse>(`${this.API_URL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, `Failed to fetch employee with ID: ${id}`);
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
          if (error.url && error.url.includes('/employee')) {
            errorMessage = 'Employee API endpoint not found. Please ensure the backend server is running.';
          } else {
            errorMessage = 'Employee not found';
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

    console.error('EmployeeService Error:', {
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

