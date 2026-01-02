import { Employee } from './employee.models';
import { Skill } from './skill.models';

// SearchResult interface for general search (as per PROMPT 1)
export interface SearchResult {
  employees: Employee[];
  skills: Skill[];
  totalCount: number;
}

// EmployeeSearchResult interface for Elasticsearch-based search (as per PROMPT 10)
export interface EmployeeSearchResult {
  employeeId: string;
  name: string;
  role: string;
  skillName: string;
  rating: number;
}

