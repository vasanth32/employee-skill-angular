import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
            },
            {
                path: 'employees',
                loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent)
            },
            {
                path: 'search',
                loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
            },
            {
                path: 'skills',
                loadComponent: () => import('./features/skills/skills-list/skills-list.component').then(m => m.SkillsListComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
