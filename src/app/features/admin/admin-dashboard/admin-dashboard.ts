import { Component } from '@angular/core';

interface StatCard {
  label: string;
  count: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  stats: StatCard[] = [
    { label: 'Sitios/Lugares', count: 12, icon: 'fa-solid fa-location-dot', color: '#d31219' },
    { label: 'Areas', count: 8, icon: 'fa-solid fa-chart-simple', color: '#b28a12' },
    { label: 'Trabajadores', count: 45, icon: 'fa-solid fa-users', color: '#d31219' },
    { label: 'Tags', count: 23, icon: 'fa-solid fa-tags', color: '#555' },
  ];
}
