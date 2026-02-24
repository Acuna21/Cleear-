import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../features/home/home').then( component => component.Home ),
    data: { roles: ["ADMIN", "REPORTER"] }
  },
  {
    path: 'create-report',
    loadComponent: () => import('../../features/create-report/create-report').then( component => component.CreateReport),
    data: { roles: ["REPORTER", "ADMIN"] }
  }
];
