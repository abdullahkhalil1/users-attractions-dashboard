import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-update-attraction-dialog',
  templateUrl: './update-attraction-dialog.component.html',
  imports: [CommonModule,
    ReactiveFormsModule,
    MaterialModule]
})
export class UpdateAttractionDialogComponent implements OnInit {
  updateAttractionForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  imageSizeError: string | null = null;
  readonly maxImageSize = 1024 * 1024;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateAttractionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateAttractionForm = this.fb.group({
      name: [data.name, Validators.required],
      detail: [data.detail, Validators.required],
      coverimage: [data.coverimage, Validators.required],
      latitude: [data.latitude, Validators.required],
      longitude: [data.longitude, Validators.required]
    });
    this.selectedImage = data.coverimage;
  }

  ngOnInit(): void { }

  get trimmedCoverImage(): string {
    const coverImage = this.updateAttractionForm.get('coverimage')?.value;
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
        this.updateAttractionForm.patchValue({
          coverimage: this.selectedImage
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.updateAttractionForm.valid) {
      this.dialogRef.close(this.updateAttractionForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
