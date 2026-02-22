import { computed, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppAuthManagement } from '@services/app-auth-management';

export const loginPageGuard: CanActivateFn = (route, state) => {
  const appAuthManagement = inject(AppAuthManagement);
  const router = inject(Router);
  const isAuthenticated = computed(() => !!appAuthManagement.currentUser() );

  if ( isAuthenticated() ) return router.navigateByUrl('/');

  return true;
};
