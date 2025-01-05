import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersFacade } from '../../services/users.facade';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersFacadeMock: jasmine.SpyObj<UsersFacade>;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  // Mock data
  const mockUsers: User[] = [
    { id: '1', fname: 'John', lname: 'Doe', username: 'john@example.com' },
    { id: '2', fname: 'Jane', lname: 'Doe', username: 'jane@example.com' }
  ];

  beforeEach(async () => {
    // Create mock services
    usersFacadeMock = jasmine.createSpyObj('UsersFacade', [
      'handlePage',
      'setSort',
      'setSearch',
      'addUser',
      'updateUser',
      'deleteUser'
    ], {
      users$: new BehaviorSubject(mockUsers),
      totalLength$: new BehaviorSubject(10),
      perPage$: new BehaviorSubject(5),
      loading$: new BehaviorSubject(false),
      page$: new BehaviorSubject(1)
    });

    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: UsersFacade, useValue: usersFacadeMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct column definitions', () => {
    expect(component.columns).toEqual([
      { displayedName: 'ID', key: 'id' },
      { displayedName: 'First Name', key: 'fname' },
      { displayedName: 'Last Name', key: 'lname' },
      { displayedName: 'Email', key: 'username' }
    ]);
  });

  it('should handle page changes', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 100
    };

    component.onPageChange(pageEvent);
    expect(usersFacadeMock.handlePage).toHaveBeenCalledWith(2, 10);
  });

  it('should handle sort changes', () => {
    const sortEvent: Sort = {
      active: 'name',
      direction: 'asc'
    };

    component.onSortChange(sortEvent);
    expect(usersFacadeMock.setSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('should handle search changes', () => {
    const searchQuery = 'John';
    component.onSearch(searchQuery);
    expect(usersFacadeMock.setSearch).toHaveBeenCalledWith(searchQuery);
  });

  describe('Dialog operations', () => {
    it('should open add user dialog and handle result', fakeAsync(() => {
      const mockDialogRef = {
        afterClosed: () => of({
          email: 'new@example.com',
          password: 'password',
          fname: 'New',
          lname: 'User'
        })
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onAddUser();
      tick();

      expect(dialogMock.open).toHaveBeenCalledWith(AddUserDialogComponent, {
        width: '400px',
        height: '100vh',
        position: { right: '0' },
        panelClass: 'full-height-dialog'
      });
      expect(usersFacadeMock.addUser).toHaveBeenCalled();
    }));

    it('should open update user dialog and handle result', fakeAsync(() => {
      const mockUser = mockUsers[0];
      const mockDialogRef = {
        afterClosed: () => of({ fname: 'Updated', lname: 'Name' })
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onUpdateUser(mockUser);
      tick();

      expect(dialogMock.open).toHaveBeenCalledWith(UpdateUserDialogComponent, {
        width: '400px',
        height: '100vh',
        position: { right: '0' },
        panelClass: 'full-height-dialog',
        data: mockUser
      });
      expect(usersFacadeMock.updateUser).toHaveBeenCalled();
    }));

    it('should open delete confirmation dialog and handle confirmation', fakeAsync(() => {
      const mockUser = mockUsers[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onDeleteUser(mockUser);
      tick();

      expect(dialogMock.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        width: '30%',
        data: { message: `Are you sure you want to delete user ${mockUser.username}?` }
      });
      expect(usersFacadeMock.deleteUser).toHaveBeenCalledWith(mockUser.id);
    }));

    it('should not delete user when confirmation is cancelled', fakeAsync(() => {
      const mockUser = mockUsers[0];
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onDeleteUser(mockUser);
      tick();

      expect(usersFacadeMock.deleteUser).not.toHaveBeenCalled();
    }));
  });

  describe('Observable streams', () => {
    it('should properly subscribe to facade observables', (done) => {
      component.users$.subscribe(users => {
        expect(users).toEqual(mockUsers);
        done();
      });
    });

    it('should handle loading state', (done) => {
      component.loading$.subscribe(loading => {
        expect(loading).toBeFalse();
        done();
      });
    });
  });
});