import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'citizen',
    canActivate: [authGuard],
    data: { roles: [UserRole.CITIZEN, UserRole.SYSTEM_ADMIN] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/citizen/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'lodge-grievance',
        loadComponent: () => import('./features/citizen/lodge-grievance/lodge-grievance').then(m => m.LodgeGrievanceComponent)
      },
      {
        path: 'my-grievances',
        loadComponent: () => import('./features/citizen/my-grievances/my-grievances').then(m => m.MyGrievancesComponent)
      },
      {
        path: 'grievance/:id',
        loadComponent: () => import('./features/citizen/grievance-details/grievance-details').then(m => m.GrievanceDetailsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'officer',
    canActivate: [authGuard],
    data: { roles: [UserRole.DEPARTMENT_OFFICER, UserRole.SYSTEM_ADMIN] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/officer/dashboard/dashboard').then(m => m.OfficerDashboardComponent)
      },
      {
        path: 'assigned-grievances',
        loadComponent: () => import('./features/officer/assigned-grievances/assigned-grievances').then(m => m.AssignedGrievancesComponent)
      },
      {
        path: 'grievance/:id',
        loadComponent: () => import('./features/officer/grievance-details/grievance-details').then(m => m.OfficerGrievanceDetailsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'supervisor',
    canActivate: [authGuard],
    data: { roles: [UserRole.SUPERVISORY_OFFICER, UserRole.SYSTEM_ADMIN] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/supervisor/dashboard/dashboard').then(m => m.SupervisorDashboardComponent)
      },
      {
        path: 'all-grievances',
        loadComponent: () => import('./features/supervisor/all-grievances/all-grievances').then(m => m.AllGrievancesComponent)
      },
      {
        path: 'grievance/:id',
        loadComponent: () => import('./features/supervisor/grievance-details/grievance-details').then(m => m.SupervisorGrievanceDetailsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: [UserRole.SYSTEM_ADMIN] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/reports').then(m => m.ReportsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
