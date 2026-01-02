import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SearchService } from '../../core/services/search.service';
import { EmployeeSearchResult } from '../../models/search.models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  displayedColumns: string[] = ['name', 'role', 'skillName', 'rating'];
  searchResults: EmployeeSearchResult[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';
  hasSearched = false;

  ratingOptions = [
    { value: 1, label: '1 Star' },
    { value: 2, label: '2 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 5, label: '5 Stars' }
  ];

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the search form
   */
  private initializeForm(): void {
    this.searchForm = this.fb.group({
      skill: [''],
      rating: ['']
    });
  }

  /**
   * Perform search
   */
  onSearch(): void {
    const formValue = this.searchForm.value;
    const skill = formValue.skill?.trim() || undefined;
    const minRating = formValue.rating ? Number(formValue.rating) : undefined;

    // If both fields are empty, don't search
    if (!skill && !minRating) {
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.hasSearched = true;

    this.searchService.searchEmployees(skill, minRating).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.message || 'Failed to search employees. Please try again.';
        this.searchResults = [];
        console.error('Error searching employees:', error);
      }
    });
  }

  /**
   * Clear search form and results
   */
  onClear(): void {
    this.searchForm.reset();
    this.searchResults = [];
    this.hasSearched = false;
    this.hasError = false;
    this.errorMessage = '';
  }

  /**
   * Check if search results are empty
   */
  get isEmpty(): boolean {
    return this.hasSearched && !this.isLoading && !this.hasError && this.searchResults.length === 0;
  }

  /**
   * Get rating display with stars
   */
  getRatingDisplay(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  /**
   * Get rating color class
   */
  getRatingClass(rating: number): string {
    if (rating >= 4) return 'rating-high';
    if (rating >= 3) return 'rating-medium';
    return 'rating-low';
  }
}
