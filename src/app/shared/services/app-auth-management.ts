import { inject, Injectable, signal } from '@angular/core';
import { AzureAuthManagement } from './azure-auth-management';
import { Router } from '@angular/router';
import { firstValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { IAuthDTO, UserAuth, UserLogin } from '@models/auth-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Role } from '@enums/role';

@Injectable({
  providedIn: 'root',
})
export class AppAuthManagement {

  private readonly azureAuthManagement = inject(AzureAuthManagement);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  public currentUser = signal<UserAuth | null>(null);

  async initialiceAppAuth(): Promise<void> {
    try {
      const azureAccount = await this.azureAuthManagement.initAzureAuth();

      if (azureAccount) {
        await firstValueFrom(this.azureAuthManagement.syncWithBackend());

        this.loadSession();
        this.router.navigateByUrl('/');
      } else {
        this.loadSession()
      }
    } catch (error) {
      console.error('Fallo en la inicialización de auth:', error);
    }
  }

  public loadSession(): void {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user_data');
    if (token && refreshToken && user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  public refreshToken(): Observable<UserLogin> {
    const userId = this.currentUser()?.id;
    const refreshToken = localStorage.getItem('refresh_token');
    if (!userId || !refreshToken) {
      return throwError(() => new Error('No hay credenciales para refrescar'));
    }
    const url = environment.api.url + environment.api.refreshToken;
    return this.http.post<IAuthDTO>(url, {userId, refreshToken})
    .pipe(
      map((res:IAuthDTO) => ({
        ...res,
        user: {
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.full_name,
          role: res.user.role,
          image: res.user.image,
        }
      })),
      tap((userLogin) => {
        localStorage.setItem('refresh_token', userLogin.refreshToken);
        localStorage.setItem('access_token', userLogin.accessToken);
        localStorage.setItem('user_data', JSON.stringify(userLogin.user));
        this.loadSession()
      })
    )
  }

  public hasRole(roles: Role[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  public logout() {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigateByUrl('/auth')
  }
}
