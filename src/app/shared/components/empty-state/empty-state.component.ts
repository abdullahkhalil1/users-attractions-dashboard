import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  imports: [CommonModule, MaterialModule]
})
export class EmptyStateComponent {
  @Input() message: string = 'No data available';
}