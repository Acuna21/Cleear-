import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@components/header/header';
import { AppAuthManagement } from '@services/app-auth-management';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {

  protected userName = computed(() => this.appAuthManagement.currentUser()?.fullName || '');
  protected userRole = computed(() => this.appAuthManagement.currentUser()?.role || '');

  private readonly appAuthManagement = inject(AppAuthManagement);

}
