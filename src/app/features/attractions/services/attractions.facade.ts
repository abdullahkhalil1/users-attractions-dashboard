import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { AttractionsService } from './attractions.service';
import { Attraction, PaginatedAttractions } from '../../../core/models/attraction.modal';

@Injectable({
    providedIn: 'root'
})
export class AttractionsFacade {
    private attractionsSubject = new BehaviorSubject<Attraction[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalLengthSubject = new BehaviorSubject<number>(0);
    private searchSubject = new BehaviorSubject<string>('');
    private pageSubject = new BehaviorSubject<number>(1);
    private perPageSubject = new BehaviorSubject<number>(4);
    private sortColumnSubject = new BehaviorSubject<string>('name');
    private sortOrderSubject = new BehaviorSubject<string>('desc');

    attractions$ = this.attractionsSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();
    totalLength$ = this.totalLengthSubject.asObservable();
    page$ = this.pageSubject.asObservable();
    perPage$ = this.perPageSubject.asObservable();

    constructor(private attractionsService: AttractionsService) { }

    setSearch(search: string) {
        this.searchSubject.next(search);
        this.pageSubject.next(1);
        this.loadAttractions();
    }

    handlePage(page: number, perPage: number) {
        this.pageSubject.next(page);
        this.perPageSubject.next(perPage);
        this.loadAttractions();

    }

    setSort(sortColumn: string, sortOrder: string) {
        this.sortColumnSubject.next(sortColumn);
        this.sortOrderSubject.next(sortOrder);
        const stopLoading = true;
        this.loadAttractions(stopLoading);
    }

    loadAttractions(stopLoading: boolean = false) {
        !stopLoading && this.loadingSubject.next(true);
        const searchValue = this.searchSubject.value;
        const page = this.pageSubject.value;
        const perPage = this.perPageSubject.value;
        const sortColumn = this.sortColumnSubject.value;
        const sortOrder = this.sortOrderSubject.value;

        this.attractionsService.getAttractions(searchValue, page, perPage, sortColumn, sortOrder).subscribe({
            next: (response: PaginatedAttractions) => {
                this.loadingSubject.next(false);
                this.totalLengthSubject.next(response.total);
                this.attractionsSubject.next(response.data);
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    addAttraction(attraction: Attraction) {
        this.loadingSubject.next(true);
        this.attractionsService.addAttraction(attraction).subscribe({
            next: () => {
                this.loadAttractions()
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    updateAttraction(attraction: Attraction) {
        this.loadingSubject.next(true);
        this.attractionsService.updateAttraction(attraction).subscribe({
            next: () => {
                this.loadAttractions()
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    deleteAttraction(attractionId: string) {
        this.loadingSubject.next(true);
        this.attractionsService.deleteAttraction(attractionId).subscribe({
            next: () => {
                this.loadAttractions()
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }
}
