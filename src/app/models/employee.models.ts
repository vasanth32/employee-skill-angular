import { EmployeeSkill } from './skill.models';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  hireDate?: Date;
}

export interface EmployeeResponse {
  employee: Employee;
  skills: EmployeeSkill[];
}

// EmployeeResponse interface for API responses (as per PROMPT 6)
export interface EmployeeApiResponse {
  employeeId: string;
  name: string;
  email: string;
  role: string;
}

