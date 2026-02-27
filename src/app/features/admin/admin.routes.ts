import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  // Placeholder routes for future admin sub-pages
  {
    path: 'locations',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'areas',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'workers',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'area-managers',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'criticality',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'task-states',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
  {
    path: 'incident-weights',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
  },
];
