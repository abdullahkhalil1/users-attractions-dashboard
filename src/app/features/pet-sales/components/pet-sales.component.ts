import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { format } from 'date-fns';


import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PetSalesFacade } from '../services/pet-sales.facade';
import { MaterialModule } from '../../../shared/material/material.module';
import { TableComponent } from '../../../shared/components/table/table.component';
import { BreakpointService } from '../../../shared/services/break-point.service';
import { ChartData, DailySale } from '../../../core/models/pet-sales.model';

@Component({
  selector: 'app-pet-sales',
  templateUrl: './pet-sales.component.html',
  imports: [CommonModule, BaseChartDirective, MaterialModule, TableComponent],

})
export class PetSalesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  isMobile$: Observable<boolean>;
  chartData$: Observable<ChartData>;
  dailySales$: Observable<DailySale[]>;
  chartDataLoading$: Observable<boolean>;
  dailySalesLoading$: Observable<boolean>;
  defaultDate: string;

  chartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "'Arial', sans-serif"
          },
          usePointStyle: true,
          boxWidth: 50
        }
      },
      title: {
        display: true,
        text: 'Weekly Pet Sales Trend',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Sales Amount',
          color: 'black',
          padding: 15,
          font: {
            size: 14
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          padding: 15,
          color: 'black',
          font: {
            size: 14
          }
        }
      }
    }
  };

  columns: { displayedName: string, key: string }[] = [
    { displayedName: 'Date', key: 'date' },
    { displayedName: 'Animal', key: 'animal' },
    { displayedName: 'Price', key: 'price' },
  ];

  constructor(private petSalesFacade: PetSalesFacade, private breakpointService: BreakpointService) {
    this.chartData$ = this.petSalesFacade.chartData$;
    this.dailySales$ = this.petSalesFacade.dailySales$;
    this.chartDataLoading$ = this.petSalesFacade.chartDataLoading$;
    this.dailySalesLoading$ = this.petSalesFacade.dailySalesLoading$;
    const today = new Date();
    this.defaultDate = format(today, 'yyyy-MM-dd');
    this.isMobile$ = this.breakpointService.isMobile();
  }

  ngOnInit(): void {
    this.petSalesFacade.loadWeeklySalesData(this.defaultDate);
    this.petSalesFacade.loadDailySalesData(this.defaultDate);
  }

  onDateChange(event: any): void {
    const selectedDate = event.value;
    this.petSalesFacade.loadWeeklySalesData(this.formatDate(selectedDate));
    this.petSalesFacade.loadDailySalesData(this.formatDate(selectedDate));
  }

  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

}