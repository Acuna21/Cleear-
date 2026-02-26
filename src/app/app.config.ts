import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { msalConfig } from './msal-config'
import { AppAuthManagement } from '@services/app-auth-management';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    importProvidersFrom(
      BrowserModule,
    ),
    ...msalConfig,
    provideAppInitializer(() => {
      const appAuthManagement = inject(AppAuthManagement);
      return appAuthManagement.initialiceAppAuth()
    })
  ]
};
