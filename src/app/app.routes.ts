import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/app-layout/app-layout').then( component => component.AppLayout),
    loadChildren: () => import('./layout/routes/private.routes').then( routes => routes.privateRoutes )
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth-methods/auth-methods').then( component => component.AuthMethods )
  }
];
