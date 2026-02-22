import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IAuthDTO, UserLogin } from '@models/auth-response.model';
import { map, Observable, tap } from 'rxjs';
import { AppAuthManagement } from './app-auth-management';

@Injectable({
  providedIn: 'root',
})
export class CredentialsAuthManagement {

  private readonly http = inject(HttpClient);
  private readonly appAuthManagement = inject(AppAuthManagement);

  login(email:string, password:string):Observable<UserLogin> {
    const url = environment.api.url + environment.api.loginUrl;
    return this.http.post<IAuthDTO>(url, {email, password})
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
        this.appAuthManagement.loadSession()
      }),
    )
  }
}
