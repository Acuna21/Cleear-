import { inject, Injectable, signal } from '@angular/core';
import { AzureAuthManagement } from './azure-auth-management';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
type Role = string;

@Injectable({
  providedIn: 'root',
})
export class AppAuthManagement {

  private readonly azureAuthManagement = inject(AzureAuthManagement);
  private readonly router = inject(Router);

  currentUser = signal<{ id: string; role: Role; name: string } | null>(null);

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
    const user = localStorage.getItem('user_data');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  public hasRole(roles: Role[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  public logout() {
    localStorage.clear();
    this.currentUser.set(null);
  }
}
