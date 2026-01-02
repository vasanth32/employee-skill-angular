# Skill Rating Dialog - Usage Example

## How to Open the Dialog

### 1. Import Required Modules

In your component:

```typescript
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SkillRatingDialogComponent, SkillRatingDialogData } from '../skills/skill-rating-dialog/skill-rating-dialog.component';
import { EmployeeSkillResponse } from '../../../models/skill.models';
```

### 2. Inject MatDialog

```typescript
constructor(private dialog: MatDialog) {}
```

### 3. Open Dialog for Adding New Skill Rating

```typescript
openAddSkillRatingDialog(employeeId: string): void {
  const dialogData: SkillRatingDialogData = {
    employeeId: employeeId
  };

  const dialogRef = this.dialog.open(SkillRatingDialogComponent, {
    width: '500px',
    data: dialogData,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Skill rating saved:', result);
      // Refresh your data or update UI
      this.loadEmployeeSkills();
    }
  });
}
```

### 4. Open Dialog for Editing Existing Skill Rating

```typescript
openEditSkillRatingDialog(employeeId: string, employeeSkill: EmployeeSkillResponse): void {
  const dialogData: SkillRatingDialogData = {
    employeeId: employeeId,
    employeeSkill: employeeSkill
  };

  const dialogRef = this.dialog.open(SkillRatingDialogComponent, {
    width: '500px',
    data: dialogData,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Skill rating updated:', result);
      // Refresh your data or update UI
      this.loadEmployeeSkills();
    }
  });
}
```

### 5. Complete Example Component

```typescript
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SkillRatingDialogComponent, SkillRatingDialogData } from '../skills/skill-rating-dialog/skill-rating-dialog.component';
import { EmployeeSkillResponse } from '../../../models/skill.models';

@Component({
  selector: 'app-employee-skills',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button color="primary" (click)="addSkill()">
      Add Skill Rating
    </button>
  `
})
export class EmployeeSkillsComponent {
  employeeId = 'emp-123';

  constructor(private dialog: MatDialog) {}

  addSkill(): void {
    const dialogData: SkillRatingDialogData = {
      employeeId: this.employeeId
    };

    const dialogRef = this.dialog.open(SkillRatingDialogComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Saved:', result);
      }
    });
  }
}
```

## Dialog Data Interface

```typescript
export interface SkillRatingDialogData {
  employeeId: string;                    // Required: Employee ID
  employeeSkill?: EmployeeSkillResponse;   // Optional: For edit mode
}
```

## Dialog Response

The dialog returns `EmployeeSkillResponse` when saved successfully, or `undefined` when cancelled.

```typescript
{
  employeeSkillId: string;
  employeeId: string;
  skillId: string;
  skillName: string;
  rating: number;
  trainingNeeded: boolean;
}
```

## Features

- ✅ Add new skill rating
- ✅ Edit existing skill rating
- ✅ Skill dropdown (loaded from API)
- ✅ Rating selection (1-5 stars)
- ✅ Training needed checkbox
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

