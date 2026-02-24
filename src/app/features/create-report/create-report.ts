import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '@components/button/button';
import { UiFileUploadComponent } from '@components/ui-file-upload/ui-file-upload';
import { UiSelectComponent } from '@components/ui-select/ui-select';
import { UiTextArea } from '@components/ui-text-area/ui-text-area';

@Component({
  selector: 'app-create-report',
  imports: [
    ReactiveFormsModule, 
    UiTextArea,
    UiSelectComponent,
    UiFileUploadComponent,
    Button
  ],
  templateUrl: './create-report.html',
  styleUrl: './create-report.scss',
})
export class CreateReport {
  protected submittedData = signal<any | null>(null);
  protected isValid = signal<boolean>(false);
  
  protected reportForm = new FormGroup({
      description: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
      floor: new FormControl<string>('', Validators.required),
      space: new FormControl<string>('', Validators.required),
      files: new FormControl<File[] | null>(null)
  });

  submit(): void {
    if (this.reportForm.invalid) return;

    const data = this.reportForm.getRawValue();
    this.submittedData.set(data);

    console.log(data);
  }

   onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const filesArray = Array.from(input.files);
    this.reportForm.patchValue({ files: filesArray });
  }

}
