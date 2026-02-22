import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { environment } from '@environments/environment';
import { IAuthDTO, UserLogin } from '@models/auth-response.model';
import { from, map, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AzureAuthManagement {

  private readonly msalService = inject(MsalService);
  private readonly http = inject(HttpClient);

  public async initAzureAuth(): Promise<AccountInfo | null> {
    await this.msalService.instance.initialize();

    const result = await this.msalService.instance.handleRedirectPromise();

    if (result) {
      this.msalService.instance.setActiveAccount(result.account);
      return result.account;
    }

    return this.msalService.instance.getActiveAccount();
  }

  public syncWithBackend(): Observable<UserLogin> {
    return this.getAccessToken().pipe(
      switchMap( accessToken => {
        const url = environment.api.url + environment.api.azureLoginUrl;
        return this.http.post<IAuthDTO>(url, {}, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      }),
      map( res => ({
        ...res,
        user: {
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.full_name,
          image: res.user.image,
          role: res.user.role
        }
      })),
      tap( userLogin => {
        localStorage.setItem('refresh_token', userLogin.refreshToken);
        localStorage.setItem('access_token', userLogin.accessToken);
        localStorage.setItem('user_data', JSON.stringify(userLogin.user));
      })
    )
  }

  private getAccessToken(): Observable<string> {
  const account = this.msalService.instance.getActiveAccount();
  if (!account) return throwError(() => new Error('No hay cuenta activa'));

  const request = {
    scopes: [`api://${environment.azure.clientId}/access_as_user`],
    account: account
  };

  return from(this.msalService.instance.acquireTokenSilent(request)).pipe(
    map(result => result.accessToken)
  );
}

  public login(): void {
    this.msalService.loginRedirect();
  }

  public logout(): void {
    this.msalService.logoutRedirect();
  }
}
