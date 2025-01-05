import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-add-attraction-dialog',
  templateUrl: './add-attraction-dialog.component.html',
  imports: [CommonModule,
    ReactiveFormsModule,
    MaterialModule]
})
export class AddAttractionDialogComponent {
  addAttractionForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  imageSizeError: string | null = null;
  readonly maxImageSize = 1024 * 1024;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAttractionDialogComponent>,
  ) {
    this.addAttractionForm = this.fb.group({
      name: ['', Validators.required],
      detail: ['', Validators.required],
      coverimage: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  get trimmedCoverImage(): string {
    const coverImage = this.addAttractionForm.get('coverimage')?.value;
    return coverImage ? `${coverImage.slice(0, 30)}...` : '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.maxImageSize) {
        this.imageSizeError = 'Image size should not exceed 1MB';
        return;
      }
      this.imageSizeError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        this.addAttractionForm.patchValue({
          coverimage: this.selectedImage
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.addAttractionForm.valid) {
      this.dialogRef.close(this.addAttractionForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}