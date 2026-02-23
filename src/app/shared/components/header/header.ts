import { Component, Input, Output, EventEmitter, input, output, computed } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {

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
    this.addClicked.emit();
  }


}
