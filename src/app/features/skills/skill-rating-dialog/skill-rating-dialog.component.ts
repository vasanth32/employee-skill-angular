import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SkillService } from '../../../core/services/skill.service';
import { SkillResponse, EmployeeSkillResponse, EmployeeSkillRateRequest } from '../../../models/skill.models';

export interface SkillRatingDialogData {
  employeeId: string;
  employeeSkill?: EmployeeSkillResponse; // For edit mode
}

@Component({
  selector: 'app-skill-rating-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './skill-rating-dialog.component.html',
  styleUrl: './skill-rating-dialog.component.scss'
})
export class SkillRatingDialogComponent implements OnInit {
  skillRatingForm!: FormGroup;
  skills: SkillResponse[] = [];
  isLoading = false;
  isLoadingSkills = false;
  errorMessage = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private dialogRef: MatDialogRef<SkillRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SkillRatingDialogData
  ) {
    this.isEditMode = !!data.employeeSkill;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSkills();
  }

  /**
   * Initialize the form with validators
   */
  private initializeForm(): void {
    const employeeSkill = this.data.employeeSkill;

    this.skillRatingForm = this.fb.group({
      skillId: [employeeSkill?.skillId || '', [Validators.required]],
      rating: [employeeSkill?.rating || 1, [Validators.required, Validators.min(1), Validators.max(5)]],
      trainingNeeded: [employeeSkill?.trainingNeeded || false]
    });

    // Disable skill selection in edit mode
    if (this.isEditMode) {
      this.skillRatingForm.get('skillId')?.disable();
    }
  }

  /**
   * Load all available skills
   */
  private loadSkills(): void {
    this.isLoadingSkills = true;
    this.skillService.getAllSkills().subscribe({
      next: (skills) => {
        this.skills = skills;
        this.isLoadingSkills = false;
      },
      error: (error) => {
        this.isLoadingSkills = false;
        this.errorMessage = error.message || 'Failed to load skills. Please try again.';
        console.error('Error loading skills:', error);
      }
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.skillRatingForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.skillRatingForm.getRawValue(); // Use getRawValue() to get disabled field values
    const request: EmployeeSkillRateRequest = {
      skillId: formValue.skillId,
      rating: formValue.rating,
      trainingNeeded: formValue.trainingNeeded
    };

    this.skillService.rateSkill(this.data.employeeId, request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to save skill rating. Please try again.';
        console.error('Error saving skill rating:', error);
      }
    });
  }

  /**
   * Cancel dialog
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.skillRatingForm.controls).forEach(key => {
      const control = this.skillRatingForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get error message for skill field
   */
  getSkillErrorMessage(): string {
    const skillControl = this.skillRatingForm.get('skillId');
    if (skillControl?.hasError('required')) {
      return 'Please select a skill';
    }
    return '';
  }

  /**
   * Get error message for rating field
   */
  getRatingErrorMessage(): string {
    const ratingControl = this.skillRatingForm.get('rating');
    if (ratingControl?.hasError('required')) {
      return 'Rating is required';
    }
    if (ratingControl?.hasError('min') || ratingControl?.hasError('max')) {
      return 'Rating must be between 1 and 5';
    }
    return '';
  }

  /**
   * Check if field has error and is touched
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.skillRatingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get rating options (1-5)
   */
  getRatingOptions(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
