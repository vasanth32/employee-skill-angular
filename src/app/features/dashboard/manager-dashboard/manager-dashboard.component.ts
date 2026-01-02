import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { SkillService } from '../../../core/services/skill.service';
import { EmployeeApiResponse } from '../../../models/employee.models';
import { SkillResponse } from '../../../models/skill.models';

interface DashboardSummary {
  totalEmployees: number;
  totalSkills: number;
  averageRating: number;
  employeesWithSkills: number;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {
  employees: EmployeeApiResponse[] = [];
  skills: SkillResponse[] = [];
  summary: DashboardSummary = {
    totalEmployees: 0,
    totalSkills: 0,
    averageRating: 0,
    employeesWithSkills: 0
  };
  isLoading = false;
  hasError = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private skillService: SkillService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    // Load employees and skills in parallel
    const employees$ = this.employeeService.getAllEmployees();
    const skills$ = this.skillService.getAllSkills();

    // Use forkJoin to wait for both requests
    forkJoin([employees$, skills$]).subscribe({
      next: ([employees, skills]) => {
        this.employees = employees;
        this.skills = skills;
        this.computeSummary();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;

        // Provide more user-friendly error messages
        if (error.status === 404) {
          this.errorMessage = 'API endpoints not found. Please ensure the backend server is running on http://localhost:5112';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check if the backend API is running.';
        } else {
          this.errorMessage = error.message || 'Failed to load dashboard data. Please try again.';
        }

        console.error('Error loading dashboard data:', error);
      }
    });
  }

  /**
   * Compute dashboard summary statistics
   */
  private computeSummary(): void {
    this.summary = {
      totalEmployees: this.employees.length,
      totalSkills: this.skills.length,
      averageRating: 0, // This would need employee skills data to calculate
      employeesWithSkills: 0 // This would need employee skills data to calculate
    };
  }

  /**
   * Get recent employees (last 5)
   */
  getRecentEmployees(): EmployeeApiResponse[] {
    return this.employees.slice(0, 5);
  }

  /**
   * Retry loading dashboard data
   */
  retry(): void {
    this.loadDashboardData();
  }
}
