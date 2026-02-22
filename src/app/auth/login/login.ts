import { Component, inject, OnInit } from '@angular/core';
import { AzureAuthManagement } from '@services/azure-auth-management';
import { AuthForm } from '../auth-form/auth-form';
import { Button } from '@components/button/button';
import { CredentialsAuthManagement } from '@services/credentials-auth-management';
import { Router } from '@angular/router';

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

  protected loginWithCredentials(credentials: { email:string, password:string }): void {
    const { email, password } = credentials;
    if (!email || !password) return
    this.credentialsAuthManagement.login(email, password).subscribe( user => {
      if (user) this.router.navigateByUrl('/');
    })
  }

  protected loginWithAzure(): void {
    this.azureAuthManagement.login();
  }

}
