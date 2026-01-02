import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SearchResult, EmployeeSearchResult } from '../../models/search.models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly API_URL = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) { }

  /**
   * Search all with optional filters
   * @param skill Optional skill name filter
   * @param minRating Optional minimum rating filter
   * @returns Observable<SearchResult[]> - Array of search results
   */
  search(skill?: string, minRating?: number): Observable<SearchResult[]> {
    let params = new HttpParams();

    if (skill) {
      params = params.set('skill', skill);
    }

    if (minRating !== undefined && minRating !== null) {
      params = params.set('minRating', minRating.toString());
    }

    return this.http.get<SearchResult[]>(this.API_URL, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, 'Failed to search');
      })
    );
  }

  /**
   * Search employees with optional filters
   * Uses Elasticsearch-based search
   * Note: This method may return EmployeeSearchResult[] for component compatibility
   * Use search() method for SearchResult[] format as per API documentation
   * @param skill Optional skill name filter
   * @param minRating Optional minimum rating filter
   * @returns Observable<EmployeeSearchResult[]> - Array of matching employee search results
   */
  searchEmployees(skill?: string, minRating?: number): Observable<EmployeeSearchResult[]> {
    let params = new HttpParams();

    if (skill) {
      params = params.set('skill', skill);
    }

    if (minRating !== undefined && minRating !== null) {
      params = params.set('minRating', minRating.toString());
    }

    return this.http.get<EmployeeSearchResult[]>(this.API_URL, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, 'Failed to search employees');
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
          errorMessage = 'Search endpoint not found';
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your search parameters.';
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
          errorMessage = 'Search service unavailable. The server is temporarily unavailable.';
          break;
        default:
          errorMessage = error.error?.message ||
            `API Error: ${error.status} - ${error.statusText || 'Unknown error'}`;
      }
    }

    console.error('SearchService Error:', {
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

