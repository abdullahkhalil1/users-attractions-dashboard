import { TestBed } from '@angular/core/testing';
import { UsersFacade } from './users.facade';
import { UsersService } from './users.service';
import { of, throwError } from 'rxjs';
import { PaginatedUsers, User } from '../../../core/models/user.model';

describe('UsersFacade', () => {
    let facade: UsersFacade;
    let service: jasmine.SpyObj<UsersService>;

    beforeEach(() => {
        const serviceSpy = jasmine.createSpyObj('UsersService', [
            'getUsers',
            'addUser',
            'updateUser',
            'deleteUser'
        ]);

        TestBed.configureTestingModule({
            providers: [
                UsersFacade,
                { provide: UsersService, useValue: serviceSpy }
            ]
        });

        service = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
        service.getUsers.and.returnValue(of(mockPaginatedUsers)); // Default mock for getUsers
        facade = TestBed.inject(UsersFacade); // Initialize after mocks are set
    });

    const mockUser: User = {
        id: '1',
        fname: 'John',
        lname: 'Doe',
        username: 'john@example.com'
    };

    const mockPaginatedUsers: PaginatedUsers = {
        data: [mockUser],
        total: 1,
        page: 1,
        per_page: 5,
        total_pages: 1
    };

    describe('loadUsers', () => {
        it('should load users and update observables', (done) => {
            service.getUsers.and.returnValue(of(mockPaginatedUsers));

            facade.loadUsers();

            facade.users$.subscribe(users => {
                expect(users).toEqual(mockPaginatedUsers.data);
                done();
            });
            facade.totalLength$.subscribe(total => {
                expect(total).toEqual(mockPaginatedUsers.total);
            });
        });

        it('should handle errors and stop loading', (done) => {
            service.getUsers.and.returnValue(throwError(() => new Error('Error')));

            facade.loadUsers();

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('setSearch', () => {
        it('should set search value and reload users', (done) => {
            spyOn(facade, 'loadUsers');
            facade.setSearch('John');

            expect(facade['searchSubject'].value).toBe('John');
            expect(facade['pageSubject'].value).toBe(1);
            expect(facade.loadUsers).toHaveBeenCalled();
            done();
        });
    });

    describe('handlePage', () => {
        it('should update page and perPage and reload users', () => {
            spyOn(facade, 'loadUsers');
            facade.handlePage(2, 10);

            expect(facade['pageSubject'].value).toBe(2);
            expect(facade['perPageSubject'].value).toBe(10);
            expect(facade.loadUsers).toHaveBeenCalled();
        });
    });

    describe('setSort', () => {
        it('should update sort column and order and reload users', () => {
            spyOn(facade, 'loadUsers');
            facade.setSort('fname', 'desc');

            expect(facade['sortColumnSubject'].value).toBe('fname');
            expect(facade['sortOrderSubject'].value).toBe('desc');
            expect(facade.loadUsers).toHaveBeenCalledWith(true);
        });
    });

    describe('addUser', () => {
        it('should add a user and reload users', (done) => {
            service.addUser.and.returnValue(of(mockUser));
            spyOn(facade, 'loadUsers');

            facade.addUser(mockUser);

            expect(service.addUser).toHaveBeenCalledWith(mockUser);
            expect(facade.loadUsers).toHaveBeenCalled();
            done();
        });

        it('should handle errors and stop loading', (done) => {
            service.addUser.and.returnValue(throwError(() => new Error('Error')));

            facade.addUser(mockUser);

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user and reload users', (done) => {
            service.updateUser.and.returnValue(of(mockUser));
            spyOn(facade, 'loadUsers');

            facade.updateUser(mockUser);

            expect(service.updateUser).toHaveBeenCalledWith(mockUser);
            expect(facade.loadUsers).toHaveBeenCalled();
            done();
        });

        it('should handle errors and stop loading', (done) => {
            service.updateUser.and.returnValue(throwError(() => new Error('Error')));

            facade.updateUser(mockUser);

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and reload users', (done) => {
            service.deleteUser.and.returnValue(of('User deleted successfully'));
            spyOn(facade, 'loadUsers');

            facade.deleteUser('1');

            expect(service.deleteUser).toHaveBeenCalledWith('1');
            expect(facade.loadUsers).toHaveBeenCalled();
            done();
        });

        it('should handle errors and stop loading', (done) => {
            service.deleteUser.and.returnValue(throwError(() => new Error('Error')));

            facade.deleteUser('1');

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });
});
