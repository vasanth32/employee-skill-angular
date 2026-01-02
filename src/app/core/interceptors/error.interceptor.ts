import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

/**
 * HTTP Interceptor to handle HTTP errors globally
 * Catches HTTP errors and passes them to ErrorHandlerService
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle HTTP errors
      if (error instanceof HttpErrorResponse) {
        // Don't show snackbar for 401 errors (handled by auth guard)
        if (error.status !== 401) {
          errorHandler.handleError(error);
        }
      } else {
        // Handle other errors
        errorHandler.handleError(error);
      }

      // Re-throw error so components can still handle it if needed
      return throwError(() => error);
    })
  );
};

