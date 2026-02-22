import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class Button {
  icon = input<string>();
  iconColor = input<'string'>();
  iconPosition = input<'left' | 'right'>('left');
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  size = input<'xl' | 'lg' | 'md' | 'sm'>('md');
  disabled = input<boolean>(false);
}
