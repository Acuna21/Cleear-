import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ui-text-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-text-area.html',
  styleUrls: ['./ui-text-area.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextArea),
      multi: true,
    },
  ],
})
export class UiTextArea implements ControlValueAccessor {

  // Inputs configurables
  label = input<string>('');
  placeholder = input<string>('');
  rows = input<number>(3);
  invalid = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  appearance = input<'outline' | 'filled'>('outline');

  // Estado interno
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

  handleInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.value.set(textarea.value);
    this.onChange(this.value());
  }
}