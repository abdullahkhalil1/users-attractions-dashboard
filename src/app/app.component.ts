import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MaterialModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'users-and-attractions-dashboard';
}
