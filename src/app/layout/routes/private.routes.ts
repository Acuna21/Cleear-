import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../home/home').then( component => component.Home ),
    data: { roles: ["ADMIN", "REPORTER"] }
  }
];
