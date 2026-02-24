import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-select.html',
  styleUrls: ['./ui-select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
})
export class UiSelectComponent implements ControlValueAccessor {

  label = input<string>('');
  placeholder = input<string>('Selecciona...');
  invalid = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  appearance = input<'outline' | 'filled'>('outline');

  options = input<{ label: string; value: string }[]>([]);

  value = signal<string>('');
  disabled = signal<boolean>(false);

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value.set(select.value);
    this.onChange(this.value());
  }
}