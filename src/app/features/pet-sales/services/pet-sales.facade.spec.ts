import { TestBed } from '@angular/core/testing';
import { PetSalesFacade } from './pet-sales.facade';
import { PetSalesService } from './pet-sales.service';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('PetSalesFacade', () => {
    let facade: PetSalesFacade;
    let service: jasmine.SpyObj<PetSalesService>;

    beforeEach(() => {
        const serviceSpy = jasmine.createSpyObj('PetSalesService', ['getWeeklySales', 'getDailySales']);

        TestBed.configureTestingModule({
            providers: [
                PetSalesFacade,
                { provide: PetSalesService, useValue: serviceSpy },
            ],
        });

        service = TestBed.inject(PetSalesService) as jasmine.SpyObj<PetSalesService>;
        facade = TestBed.inject(PetSalesFacade);
    });

    const mockWeeklySales = {
        categories: ['Mon', 'Tue', 'Wed'],
        series: [
            { name: 'Cats', data: [10, 20, 30] },
            { name: 'Dogs', data: [15, 25, 35] },
        ],
    };

    const mockDailySales = [
        { date: '2025-01-01', sales: 50 },
        { date: '2025-01-02', sales: 60 },
    ];

    describe('loadWeeklySalesData', () => {
        it('should load weekly sales data and update chartData$', (done) => {
            service.getWeeklySales.and.returnValue(of(mockWeeklySales));

            facade.loadWeeklySalesData('2025-01-01');

            facade.chartData$.subscribe((chartData) => {
                expect(chartData.labels).toEqual(['Mon', 'Tue', 'Wed']);
                expect(chartData.datasets.length).toBe(2);
                expect(chartData.datasets[0].label).toBe('Cats');
                expect(chartData.datasets[1].label).toBe('Dogs');
                done();
            });
        });

        it('should handle errors and stop loading', (done) => {
            service.getWeeklySales.and.returnValue(throwError(() => new Error('Error')));

            facade.loadWeeklySalesData('2025-01-01');

            facade.loading$.subscribe((loading) => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('loadDailySalesData', () => {
        it('should load daily sales data and update dailySales$', (done) => {
            service.getDailySales.and.returnValue(of(mockDailySales));

            facade.loadDailySalesData('2025-01-01');

            facade.dailySales$.subscribe((dailySales) => {
                expect(dailySales).toEqual(mockDailySales);
                done();
            });
        });

        it('should handle errors and stop loading', (done) => {
            service.getDailySales.and.returnValue(throwError(() => new Error('Error')));

            facade.loadDailySalesData('2025-01-01');

            facade.loading$.subscribe((loading) => {
                expect(loading).toBeFalse();
                done();
            });
        });
    });

    describe('getChartColors', () => {
        it('should return chart colors with borderColor and backgroundColor arrays', () => {
            const colors = facade['getChartColors']();
            expect(colors.borderColor.length).toBeGreaterThan(0);
            expect(colors.backgroundColor.length).toBeGreaterThan(0);
            expect(colors.borderColor).toEqual(colors.backgroundColor);
        });
    });
});
