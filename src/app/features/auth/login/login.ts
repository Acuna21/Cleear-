import { Component, inject, signal } from '@angular/core';
import { AzureAuthManagement } from '@services/azure-auth-management';
import { AuthForm } from '../auth-form/auth-form';
import { Button } from '@components/button/button';
import { CredentialsAuthManagement } from '@services/credentials-auth-management';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ AuthForm, Button ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly azureAuthManagement = inject(AzureAuthManagement);
  private readonly credentialsAuthManagement = inject(CredentialsAuthManagement);
  private readonly router = inject(Router);

  protected isLoading = signal(false);
  protected isAzureLoading = signal(false);

  protected loginWithCredentials(credentials: { email:string, password:string }): void {
    const { email, password } = credentials;
    if (!email || !password) return;
    this.isLoading.set(true);
    this.credentialsAuthManagement.login(email, password).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe( user => {
      if (user) this.router.navigateByUrl('/');
    })
  }

  protected loginWithAzure(): void {
    this.isAzureLoading.set(true);
    this.azureAuthManagement.login();
  }

}
