import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { loginPageGuard } from './shared/guards/login-page-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/app-layout/app-layout').then( component => component.AppLayout),
    loadChildren: () => import('./layout/routes/private.routes').then( routes => routes.privateRoutes ),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login/login').then( component => component.Login ),
    canActivate: [loginPageGuard]
  }
];
