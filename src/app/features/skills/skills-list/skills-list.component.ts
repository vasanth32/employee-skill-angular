import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { SkillService } from '../../../core/services/skill.service';
import { SkillResponse } from '../../../models/skill.models';

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './skills-list.component.html',
  styleUrl: './skills-list.component.scss'
})
export class SkillsListComponent implements OnInit {
  displayedColumns: string[] = ['skillName', 'skillId'];
  skills: SkillResponse[] = [];
  isLoading = false;
  errorMessage = '';
  hasError = false;

  constructor(private skillService: SkillService) { }

  ngOnInit(): void {
    this.loadSkills();
  }

  /**
   * Fetch all skills from the API
   */
  loadSkills(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    console.log('Loading skills from API...');
    this.skillService.getAllSkills().subscribe({
      next: (data) => {
        console.log('Skills loaded successfully:', data);
        this.skills = data;
        this.isLoading = false;
        console.log('Skills array length:', this.skills.length);
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.message || 'Failed to load skills. Please try again later.';
        console.error('Error loading skills:', error);
      }
    });
  }

  /**
   * Retry loading skills
   */
  retry(): void {
    this.loadSkills();
  }

  /**
   * Check if skills list is empty
   */
  get isEmpty(): boolean {
    return !this.isLoading && !this.hasError && this.skills.length === 0;
  }
}
