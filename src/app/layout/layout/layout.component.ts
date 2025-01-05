import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MaterialModule } from '../../shared/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Observable, take } from 'rxjs';
import { BreakpointService } from '../../shared/services/break-point.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isMobile$: Observable<boolean>;

  links = [{ label: 'Users', path: 'users', icon: 'people' }, { label: 'Locations', path: 'attractions', icon: 'place' }, { label: 'Pet Sales', path: 'pet-sales', icon: 'insights' }];

  constructor(private authService: AuthService, private router: Router, private breakpointService: BreakpointService, private dialog: MatDialog) {
    this.isMobile$ = this.breakpointService.isMobile();
  }

  activeLink = 'users';

  ngOnInit() {
    const currentPath = this.router.url.split('/').pop() || 'users';
    this.activeLink = currentPath;
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }

  setActive(link: string) {
    this.activeLink = link;
  }

  handleNavClick(path: string, sidenav: MatSidenav): void {
    this.activeLink = path;
    this.isMobile$.pipe(take(1)).subscribe(isMobile => {
      if (isMobile) {
        sidenav.close();
      }
    });
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: { message: `Are you sure you want to logout?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}