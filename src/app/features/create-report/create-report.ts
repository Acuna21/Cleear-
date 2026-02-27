import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '@components/button/button';
import { UiFileUploadComponent } from '@components/ui-file-upload/ui-file-upload';
import { UiSelectComponent } from '@components/ui-select/ui-select';
import { UiTextArea } from '@components/ui-text-area/ui-text-area';
import { CreateTaskDto } from '@models/task-dto.model';
import { FetchLocations } from '@services/fetch-locations';
import { TaskInventory } from '@services/task-inventory';

type Option = { label: string, value: string };

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
export class CreateReport implements OnInit {
  protected isValid = signal<boolean>(false);

  protected reportForm = new FormGroup({
      description: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
      floor: new FormControl<string>('', Validators.required),
      space: new FormControl<string>('', Validators.required),
      files: new FormControl<File[] | null>(null)
  });

  protected floorOptions = computed<Option[]>(() => {
    return this.fetchLocations.locations().map( location => ({
      label: location.name,
      value: location.id
    }))
  })

  protected spaceOptions = signal<Option[]>([]);

  private readonly fetchLocations = inject(FetchLocations);
  private readonly taskInventory = inject(TaskInventory);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.reportForm?.controls?.floor.valueChanges.subscribe((value) => {
      this.reportForm.controls.space.reset();
      const floor = this.fetchLocations.locations()
        .find( loc => loc.id === value );

      if(floor && floor.childs){
        this.spaceOptions.set(floor.childs.map((child) => ({
          label: child.name,
          value: child.id
        })))
      }
    });
  }

  submit(): void {
    if (this.reportForm.invalid) return;

    const { description, space } = this.reportForm.getRawValue();
    if (!description || !space) return;
    const createTask: CreateTaskDto = {
      description,
      locationId: space,
    }
    this.taskInventory.addTask(createTask).subscribe( task => {
      this.router.navigateByUrl(`/task/${task.id}`)
    })
  }

   onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const filesArray = Array.from(input.files);
    this.reportForm.patchValue({ files: filesArray });
  }

}
