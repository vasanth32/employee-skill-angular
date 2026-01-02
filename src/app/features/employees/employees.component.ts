import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeApiResponse } from '../../models/employee.models';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role'];
  employees: EmployeeApiResponse[] = [];
  isLoading = false;
  errorMessage = '';
  hasError = false;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Fetch all employees from the API
   */
  loadEmployees(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.message || 'Failed to load employees. Please try again later.';
        console.error('Error loading employees:', error);
      }
    });
  }

  /**
   * Retry loading employees
   */
  retry(): void {
    this.loadEmployees();
  }

  /**
   * Check if employees list is empty
   */
  get isEmpty(): boolean {
    return !this.isLoading && !this.hasError && this.employees.length === 0;
  }
}
