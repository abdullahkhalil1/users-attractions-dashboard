import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { PetSalesService } from './pet-sales.service';

@Injectable({
    providedIn: 'root'
})
export class PetSalesFacade {
    private chartDataSubject = new BehaviorSubject<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
    private dailySalesSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    chartData$ = this.chartDataSubject.asObservable();
    dailySales$ = this.dailySalesSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    constructor(private petSalesService: PetSalesService) { }

    loadWeeklySalesData(date: string): void {
        this.loadingSubject.next(true);
        this.petSalesService.getWeeklySales(date).subscribe({
            next: (data) => {
                const chartData = {
                    labels: data.categories,
                    datasets: data.series.map((series: any, index: any) => ({
                        data: series.data,
                        label: series.name,
                        borderColor: this.getChartColors().borderColor[index],
                        backgroundColor: this.getChartColors().backgroundColor[index],
                        tension: 0.4
                    }))
                };
                this.chartDataSubject.next(chartData);
                this.loadingSubject.next(false);
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    loadDailySalesData(date: string): void {
        this.loadingSubject.next(true);
        this.petSalesService.getDailySales(date).subscribe({
            next: (data) => {
                this.dailySalesSubject.next(data);
                this.loadingSubject.next(false);
            },
            error: (error) => {
                this.loadingSubject.next(false);
                return throwError(() => error);
            }
        });
    }

    private getChartColors(): { borderColor: string[], backgroundColor: string[] } {
        const colors = [
            '#3f51b5',
            '#4BC0C0',
            '#36A2EB',
            '#FF9F40',
            '#FF6384',
            '#4BC0C0',
            '#FFCE56',
            '#9966FF',
            '#FF6384',
        ];
        return {
            borderColor: colors,
            backgroundColor: colors.map(color => `${color}`)
        };
    }
}