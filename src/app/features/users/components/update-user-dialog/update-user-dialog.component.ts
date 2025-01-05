import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material/material.module';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule]
})
export class UpdateUserDialogComponent implements OnInit {
  updateUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.updateUserForm = this.fb.group({
      fname: [data.fname, Validators.required],
      lname: [data.lname, Validators.required],
      email: [data.username, [Validators.required, Validators.email]]
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.updateUserForm.valid) {
      this.dialogRef.close(this.updateUserForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}