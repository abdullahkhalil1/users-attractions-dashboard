import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttractionDialogComponent } from './add-attraction-dialog.component';

describe('AddAttractionDialogComponent', () => {
  let component: AddAttractionDialogComponent;
  let fixture: ComponentFixture<AddAttractionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttractionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAttractionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
