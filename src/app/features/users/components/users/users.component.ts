import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsersFacade } from '../../services/users.facade';
import { User } from '../../../../core/models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { DebounceDirective } from '../../../../shared/directives/debounce.directive';
import { Sort } from '@angular/material/sort';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    TableComponent,
    DebounceDirective,
    EmptyStateComponent
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  totalLength$: Observable<number>;
  page$: Observable<number>;
  perPage$: Observable<number>;
  searchQuery: string = '';

  columns: { displayedName: string, key: string }[] = [
    { displayedName: 'ID', key: 'id' },
    { displayedName: 'First Name', key: 'fname' },
    { displayedName: 'Last Name', key: 'lname' },
    { displayedName: 'Email', key: 'username' }
  ];

  constructor(
    private usersFacade: UsersFacade,
    private dialog: MatDialog
  ) {
    this.users$ = this.usersFacade.users$;
    this.totalLength$ = this.usersFacade.totalLength$;
    this.perPage$ = this.usersFacade.perPage$;
    this.loading$ = this.usersFacade.loading$;
    this.page$ = this.usersFacade.page$;
  }

  onPageChange(event: PageEvent) {
    this.usersFacade.handlePage(event.pageIndex + 1, event.pageSize);
  }

  onSortChange(sort: Sort) {
    this.usersFacade.setSort(sort.active, sort.direction);
  }

  onSearch(value: string) {
    if (value !== this.searchQuery) {
      this.searchQuery = value;
      this.usersFacade.setSearch(value);
    }

  }

  onAddUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'full-height-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user = { email: result.email, password: result.password, username: result.email, fname: result.fname, lname: result.lname, avatar: 'l' };
        this.usersFacade.addUser(user as any);
      }
    });
  }

  onUpdateUser(user: User) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '400px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'full-height-dialog',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedUser = { ...user, ...result };
        this.usersFacade.updateUser(updatedUser);
      }
    });
  }

  onDeleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: { message: `Are you sure you want to delete user ${user.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersFacade.deleteUser(user.id);
      }
    });
  }
}
