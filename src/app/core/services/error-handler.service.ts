import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface ErrorInfo {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  private snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['error-snackbar']
  };

  constructor(private injector: Injector) { }

  /**
   * Handle errors globally
   */
  handleError(error: any): void {
    console.error('Global Error Handler:', error);

    // Get services using injector to avoid circular dependencies
    const snackBar = this.injector.get(MatSnackBar);
    const router = this.injector.get(Router);

    let errorMessage = 'An unexpected error occurred';
    let action = 'Dismiss';

    if (error instanceof HttpErrorResponse) {
      // HTTP Error
      errorMessage = this.getHttpErrorMessage(error);

      // Handle specific HTTP errors
      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(['/login']);
        errorMessage = 'Session expired. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to access this resource.';
      } else if (error.status === 404) {
        // More specific message for API endpoint 404s
        if (error.url && (error.url.includes('/employee') || error.url.includes('/skills') || error.url.includes('/search') || error.url.includes('/auth'))) {
          errorMessage = 'API endpoint not found. Please ensure the backend server is running on http://localhost:5112';
        } else {
          errorMessage = 'The requested resource was not found.';
        }
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      }
    } else if (error instanceof Error) {
      // JavaScript Error
      errorMessage = error.message || 'An unexpected error occurred';
    }

    // Show error notification
    snackBar.open(errorMessage, action, this.snackBarConfig);

    // Log error details
    const errorInfo: ErrorInfo = {
      message: errorMessage,
      status: error instanceof HttpErrorResponse ? error.status : undefined,
      statusText: error instanceof HttpErrorResponse ? error.statusText : undefined,
      url: error instanceof HttpErrorResponse ? (error.url || undefined) : undefined,
      timestamp: new Date()
    };

    // In production, you might want to send this to an error logging service
    this.logError(errorInfo);
  }

  /**
   * Get user-friendly error message from HTTP error
   */
  private getHttpErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return error.error.message || 'A client-side error occurred';
    } else {
      // Server-side error
      if (error.error?.message) {
        return error.error.message;
      }
      if (error.error?.error) {
        return error.error.error;
      }
      return error.message || `Error: ${error.status} ${error.statusText}`;
    }
  }

  /**
   * Log error (can be extended to send to logging service)
   */
  private logError(errorInfo: ErrorInfo): void {
    // In production, send to error logging service (e.g., Sentry, LogRocket)
    console.error('Error Info:', errorInfo);
  }

  /**
   * Show error message manually
   */
  showError(message: string, duration: number = 5000): void {
    const snackBar = this.injector.get(MatSnackBar);
    snackBar.open(message, 'Dismiss', {
      ...this.snackBarConfig,
      duration
    });
  }

  /**
   * Show success message
   */
  showSuccess(message: string, duration: number = 3000): void {
    const snackBar = this.injector.get(MatSnackBar);
    snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show info message
   */
  showInfo(message: string, duration: number = 3000): void {
    const snackBar = this.injector.get(MatSnackBar);
    snackBar.open(message, 'OK', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }
}

