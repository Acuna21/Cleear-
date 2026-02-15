import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  @Input() userName: string = 'Juan Pérez';
  @Input() userRole: string = 'Administrador';


  @Output() addClicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  // 👤 Iniciales del usuario
  get initials(): string {
    if (!this.userName) return '';
    return this.userName
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Acción del botón (Nuevo Reporte)
  onAdd(): void {
    // this.router.navigate(['/report/new']);
  }


}
