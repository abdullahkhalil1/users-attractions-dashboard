import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAttractionDialogComponent } from './update-attraction-dialog.component';

describe('UpdateAttractionDialogComponent', () => {
  let component: UpdateAttractionDialogComponent;
  let fixture: ComponentFixture<UpdateAttractionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAttractionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAttractionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
