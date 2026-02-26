// auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { UserLogin } from '@models/auth-response.model';
import { AppAuthManagement } from '@services/app-auth-management';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';


// Semáforo para manejar múltiples peticiones 401 a la vez
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const appAuthManagement = inject(AppAuthManagement);
  const accessToken = localStorage.getItem('access_token');

  // 1. Inyectar el token actual en la petición
  let authReq = req;
  if (accessToken) {
    authReq = addTokenHeader(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error) => {
      // 2. Si hay error 401 y no es una ruta de login
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/auth/azure-login') &&
        !req.url.includes('/auth/local-login') &&
        !req.url.includes('/auth/refresh')
      ) {
        return handle401Error(authReq, next, appAuthManagement);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Función que gestiona la cola de refresco
 */
const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn, appAuthManagement: AppAuthManagement) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return appAuthManagement.refreshToken().pipe(
      switchMap((res: UserLogin) => {
        isRefreshing = false;
        const newToken = res.accessToken;
        refreshTokenSubject.next(newToken);

        return next(addTokenHeader(request, newToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        appAuthManagement.logout(); // Si el refresco falla, obligar login
        return throwError(() => err);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    // Si ya hay un refresco en curso, esperamos a que termine
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(request, token!)))
    );
  }
};

/**
 * Helper para clonar la petición con el Header de Authorization
 */
const addTokenHeader = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};
