import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    MaterialModule]
})
export class AddUserDialogComponent {
  addUserForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddUserDialogComponent>) {
    this.addUserForm = this.fb.group({
      fname: ['', { validators: [Validators.required] }],
      lname: ['', { validators: [Validators.required] }],
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', { validators: [Validators.required, Validators.minLength(6)] }],
      confirmPassword: ['', { validators: [Validators.required] }]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (confirmPassword?.errors && !confirmPassword.errors['mismatch']) {
      return null;
    }

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      this.dialogRef.close(this.addUserForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}