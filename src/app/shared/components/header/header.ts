import { Component, input, output, computed, signal, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@enums/role';
import { AppAuthManagement } from '@services/app-auth-management';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  private router = inject(Router);
  private appAuthManagement = inject(AppAuthManagement);

  userName = input.required<string>();
  userRole = input.required<Role>();

  addClicked = output<void>();
  showSettingsMenu = signal(false);
  appVersion = '1.0.0';

  protected initials = computed<string>(() => {
    if(!this.userName()) return '';
    return this.userName()
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showSettingsMenu.set(false);
  }

  onAdd(): void {
    this.router.navigate(['/create-report']);
  }

  toggleSettingsMenu(event: Event): void {
    event.stopPropagation();
    this.showSettingsMenu.update(v => !v);
  }

  onLogout(): void {
    this.showSettingsMenu.set(false);
    this.appAuthManagement.logout();
  }
}
