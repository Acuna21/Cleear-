import { Component, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '@components/button/button';
import { UiInputComponent } from '@components/ui-input/ui-input';

@Component({
  selector: 'app-auth-form',
  imports: [UiInputComponent, Button, ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm implements OnInit {

  formValue = output<{email: string, password: string}>();
  protected isValid = signal<boolean>(false);

  protected formAuth = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  })

  ngOnInit(): void {
    this.formAuth.statusChanges.subscribe( status => {
      if (status === "VALID") this.isValid.set(true)
      else this.isValid.set(false)
    })
  }

  login():void {
    const { email, password } = this.formAuth.getRawValue();
    if (!email || !password) return;
    this.formValue.emit({email, password})
  }


}
