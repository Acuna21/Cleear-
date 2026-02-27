import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  mobileMenuOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fa-solid fa-house', route: '/admin' },
    { label: 'Sitios/Lugares', icon: 'fa-solid fa-location-dot', route: '/admin/locations' },
    { label: 'Areas', icon: 'fa-solid fa-chart-simple', route: '/admin/areas' },
    { label: 'Trabajadores', icon: 'fa-solid fa-users', route: '/admin/workers' },
    { label: 'Jefes de Areas', icon: 'fa-solid fa-user-tie', route: '/admin/area-managers' },
    { label: 'Tags', icon: 'fa-solid fa-tags', route: '/admin/tags' },
    { label: 'Criticidad', icon: 'fa-solid fa-circle-exclamation', route: '/admin/criticality' },
    { label: 'Estados de Tareas', icon: 'fa-solid fa-list-check', route: '/admin/task-states' },
    { label: 'Pesos de Incidencias', icon: 'fa-solid fa-weight-hanging', route: '/admin/incident-weights' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
