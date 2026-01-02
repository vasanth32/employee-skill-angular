export interface Skill {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface EmployeeSkill {
  skillId: string;
  skillName: string;
  rating: number;
  yearsOfExperience?: number;
  lastUsed?: Date;
}

export interface SkillRatingRequest {
  skillId: string;
  rating: number;
  yearsOfExperience?: number;
  lastUsed?: Date;
}

// SkillResponse interface for API responses (as per PROMPT 8)
export interface SkillResponse {
  skillId: string;
  skillName: string;
}

// EmployeeSkillResponse interface for API responses (as per PROMPT 8)
export interface EmployeeSkillResponse {
  employeeSkillId: string;
  employeeId: string;
  skillId: string;
  skillName: string;
  rating: number;
  trainingNeeded: boolean;
}

// EmployeeSkillRateRequest interface for API requests (as per PROMPT 8)
export interface EmployeeSkillRateRequest {
  skillId: string;
  rating: number;
  trainingNeeded: boolean;
}

