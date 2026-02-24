import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-file-upload.html',
  styleUrls: ['./ui-file-upload.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiFileUploadComponent),
      multi: true,
    },
  ],
})
export class UiFileUploadComponent implements ControlValueAccessor {
  label = input<string>('');
  multiple = input<boolean>(false);
  invalid = input<boolean>(false);

  files = signal<File[] | null>(null);
  disabled = signal<boolean>(false);

  onChange = (value: File[] | null) => {};
  onTouched = () => {};

  writeValue(value: File[] | null): void {
    this.files.set(value);
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

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : null;

    this.files.set(files);
    this.onChange(files);
    this.onTouched();
  }

  removeFile(index: number) {
    const current = this.files();
    if (!current) return;

    const updated = [...current];
    updated.splice(index, 1);

    this.files.set(updated.length ? updated : null);
    this.onChange(this.files());
  }
}