import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { PaginatedUsers, User } from '../../../core/models/user.model';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root'
})
export class UsersFacade {
    private usersSubject = new BehaviorSubject<User[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalLengthSubject = new BehaviorSubject<number>(0);
    private searchSubject = new BehaviorSubject<string>('');
    private pageSubject = new BehaviorSubject<number>(1);
    private perPageSubject = new BehaviorSubject<number>(5);
    private sortColumnSubject = new BehaviorSubject<string>('id');
    private sortOrderSubject = new BehaviorSubject<string>('desc');

    users$ = this.usersSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();
    totalLength$ = this.totalLengthSubject.asObservable();
    page$ = this.pageSubject.asObservable();
    perPage$ = this.perPageSubject.asObservable();

    constructor(private usersService: UsersService) { }

    setSearch(search: string) {
        this.searchSubject.next(search);
        this.pageSubject.next(1);
        this.loadUsers();
    }

    handlePage(page: number, perPage: number) {
        this.pageSubject.next(page);
        this.perPageSubject.next(perPage);
        this.loadUsers();
    }

    setSort(sortColumn: string, sortOrder: string) {
        this.sortColumnSubject.next(sortColumn);
        this.sortOrderSubject.next(sortOrder);
        const stopLoading = true;
        this.loadUsers(stopLoading);
    }

    loadUsers(stopLoading: boolean = false) {
        !stopLoading && this.loadingSubject.next(true);
        const searchValue = this.searchSubject.value;
        const page = this.pageSubject.value;
        const perPage = this.perPageSubject.value;
        const sortColumn = this.sortColumnSubject.value;
        const sortOrder = this.sortOrderSubject.value;

        this.usersService.getUsers(searchValue, page, perPage, sortColumn, sortOrder).subscribe({
            next: (response: PaginatedUsers) => {
                this.loadingSubject.next(false);
                this.totalLengthSubject.next(response.total);
                this.usersSubject.next(response.data);
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    addUser(user: User) {
        this.loadingSubject.next(true);
        this.usersService.addUser(user).subscribe({
            next: () => {
                this.loadUsers()
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    updateUser(user: User) {
        this.loadingSubject.next(true);
        this.usersService.updateUser(user).subscribe({
            next: () => {
                this.loadUsers()
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    deleteUser(userId: string) {
        this.loadingSubject.next(true);
        this.usersService.deleteUser(userId).subscribe({
            next: () => {
                this.loadUsers()
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }
}
