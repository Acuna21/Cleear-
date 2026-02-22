import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppAuthManagement } from '@services/app-auth-management';

type Role = string;

export const authGuard: CanActivateFn = (route, state) => {
  console.log('in Auth Guard');

  const appAuthManagement = inject(AppAuthManagement);
  const router = inject(Router);
  const user = appAuthManagement.currentUser();

  if(!user) {
    return router.navigateByUrl('/auth');
  }

  let currentRoute = route;

  while (currentRoute.firstChild){
    currentRoute = currentRoute.firstChild;
  }

  const allowedRoles = currentRoute.data['roles'] as Role[];

  if (!allowedRoles || allowedRoles.length === 0 || !appAuthManagement.hasRole(allowedRoles)) {
    return router.navigateByUrl('/auth');;
  }

  return true;
};
