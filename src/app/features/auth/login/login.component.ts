import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    isLoading = false;
    errorMessage = '';
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    /**
     * Initialize the login form with validators
     */
    private initializeForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe({
            next: () => {
                this.isLoading = false;
                // Get return URL from route parameters or default to '/dashboard'
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
                this.router.navigate([returnUrl]);
            },
            error: (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.handleLoginError(error);
            }
        });
    }

    /**
     * Mark all form fields as touched to show validation errors
     */
    private markFormGroupTouched(): void {
        Object.keys(this.loginForm.controls).forEach(key => {
            const control = this.loginForm.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Handle login errors
     */
    private handleLoginError(error: HttpErrorResponse): void {
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            this.errorMessage = 'Network error. Please check your connection.';
        } else {
            // Server-side error
            switch (error.status) {
                case 401:
                    this.errorMessage = 'Invalid email or password. Please try again.';
                    break;
                case 403:
                    this.errorMessage = 'Access forbidden. Please contact administrator.';
                    break;
                case 404:
                    this.errorMessage = 'Authentication service not found.';
                    break;
                case 500:
                    this.errorMessage = 'Server error. Please try again later.';
                    break;
                default:
                    this.errorMessage = error.error?.message || 'An error occurred during login. Please try again.';
            }
        }
    }

    /**
     * Get error message for email field
     */
    getEmailErrorMessage(): string {
        const emailControl = this.loginForm.get('email');
        if (emailControl?.hasError('required')) {
            return 'Email is required';
        }
        if (emailControl?.hasError('email')) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    /**
     * Get error message for password field
     */
    getPasswordErrorMessage(): string {
        const passwordControl = this.loginForm.get('password');
        if (passwordControl?.hasError('required')) {
            return 'Password is required';
        }
        if (passwordControl?.hasError('minlength')) {
            return 'Password must be at least 6 characters';
        }
        return '';
    }

    /**
     * Check if field has error and is touched
     */
    hasFieldError(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
}

