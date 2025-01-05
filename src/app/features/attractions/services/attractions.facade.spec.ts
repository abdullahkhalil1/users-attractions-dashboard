import { TestBed } from '@angular/core/testing';
import { AttractionsFacade } from './attractions.facade';
import { AttractionsService } from './attractions.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Attraction, PaginatedAttractions } from '../../../core/models/attraction.modal';

describe('AttractionsFacade', () => {
    let facade: AttractionsFacade;
    let service: jasmine.SpyObj<AttractionsService>;

    beforeEach(() => {
        const serviceSpy = jasmine.createSpyObj('AttractionsService', [
            'getAttractions',
            'addAttraction',
            'updateAttraction',
            'deleteAttraction'
        ]);

        TestBed.configureTestingModule({
            providers: [
                AttractionsFacade,
                { provide: AttractionsService, useValue: serviceSpy }
            ]
        });

        service = TestBed.inject(AttractionsService) as jasmine.SpyObj<AttractionsService>;
        service.getAttractions.and.returnValue(of(mockPaginatedAttractions)); // Default mock for getAttractions
        facade = TestBed.inject(AttractionsFacade); // Initialize after mocks are set
    });

    const mockAttraction: Attraction = {
        id: '1',
        name: 'Eiffel Tower',
        detail: 'Famous landmark in France',
        latitude: 24.3,
        longitude: 25.6,
        coverimage: 'https://example.com/eiffel.jpg'
    };

    const mockPaginatedAttractions: PaginatedAttractions = {
        data: [mockAttraction],
        total: 1,
        page: 1,
        per_page: 4,
        total_pages: 1
    };

    describe('loadAttractions', () => {
        it('should load attractions and update observables', (done) => {
            service.getAttractions.and.returnValue(of(mockPaginatedAttractions));

            facade.loadAttractions();

            facade.attractions$.subscribe(attractions => {
                expect(attractions).toEqual(mockPaginatedAttractions.data);
                done();
            });
            facade.totalLength$.subscribe(total => {
                expect(total).toEqual(mockPaginatedAttractions.total);
            });
        });

        it('should handle errors and stop loading', (done) => {
            service.getAttractions.and.returnValue(throwError(() => new Error('Error')));

            facade.loadAttractions();

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('setSearch', () => {
        it('should set search value and reload attractions', (done) => {
            spyOn(facade, 'loadAttractions');
            facade.setSearch('Tower');

            expect(facade['searchSubject'].value).toBe('Tower');
            expect(facade['pageSubject'].value).toBe(1);
            expect(facade.loadAttractions).toHaveBeenCalled();
            done();
        });
    });

    describe('handlePage', () => {
        it('should update page and perPage and reload attractions', () => {
            spyOn(facade, 'loadAttractions');
            facade.handlePage(2, 5);

            expect(facade['pageSubject'].value).toBe(2);
            expect(facade['perPageSubject'].value).toBe(5);
            expect(facade.loadAttractions).toHaveBeenCalled();
        });
    });

    describe('setSort', () => {
        it('should update sort column and order and reload attractions', () => {
            spyOn(facade, 'loadAttractions');
            facade.setSort('name', 'desc');

            expect(facade['sortColumnSubject'].value).toBe('name');
            expect(facade['sortOrderSubject'].value).toBe('desc');
            expect(facade.loadAttractions).toHaveBeenCalledWith(true);
        });
    });

    describe('addAttraction', () => {
        it('should add an attraction and reload attractions', (done) => {
            service.addAttraction.and.returnValue(of(mockAttraction));
            spyOn(facade, 'loadAttractions');

            facade.addAttraction(mockAttraction);

            expect(service.addAttraction).toHaveBeenCalledWith(mockAttraction);
            expect(facade.loadAttractions).toHaveBeenCalled();
            done();
        });

        it('should handle errors and stop loading', (done) => {
            service.addAttraction.and.returnValue(throwError(() => new Error('Error')));

            facade.addAttraction(mockAttraction);

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('updateAttraction', () => {
        it('should update an attraction and reload attractions', (done) => {
            service.updateAttraction.and.returnValue(of(mockAttraction));
            spyOn(facade, 'loadAttractions');

            facade.updateAttraction(mockAttraction);

            expect(service.updateAttraction).toHaveBeenCalledWith(mockAttraction);
            expect(facade.loadAttractions).toHaveBeenCalled();
            done();
        });

        it('should handle errors and stop loading', (done) => {
            service.updateAttraction.and.returnValue(throwError(() => new Error('Error')));

            facade.updateAttraction(mockAttraction);

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('deleteAttraction', () => {
        it('should delete an attraction and reload attractions', (done) => {
            service.deleteAttraction.and.returnValue(of('Attraction deleted successfully'));
            spyOn(facade, 'loadAttractions');

            facade.deleteAttraction('1');

            expect(service.deleteAttraction).toHaveBeenCalledWith('1');
            expect(facade.loadAttractions).toHaveBeenCalled();
            done();
        });

        it('should handle errors and stop loading', (done) => {
            service.deleteAttraction.and.returnValue(throwError(() => new Error('Error')));

            facade.deleteAttraction('1');

            facade.loading$.subscribe(loading => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });
});
