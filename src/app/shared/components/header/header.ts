import { Component, input, output, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  private router = inject(Router);

  userName = input.required<string>();
  userRole = input.required<string>();

  addClicked = output<void>();

  protected initials = computed<string>(() => {
    if(!this.userName()) return '';
    return this.userName()
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  onAdd(): void {
    console.log('Add button clicked');
    this.router.navigate(['/create-report']);
  }


}
