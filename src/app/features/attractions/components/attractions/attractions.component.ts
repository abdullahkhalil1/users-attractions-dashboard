import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Observable } from 'rxjs';
import { AttractionsFacade } from '../../services/attractions.facade';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../../shared/directives/debounce.directive';
import { MatDialog } from '@angular/material/dialog';
import { AddAttractionDialogComponent } from '../add-attraction-dialog/add-attraction-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UpdateAttractionDialogComponent } from '../update-attraction-dialog/update-attraction-dialog.component';
import { Attraction } from '../../../../core/models/attraction.modal';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { BreakpointService } from '../../../../shared/services/break-point.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';


@Component({
  selector: 'app-attractions',
  templateUrl: './attractions.component.html',
  styleUrls: ['./attractions.component.css'],
  imports: [
    CommonModule,
    MaterialModule,
    DebounceDirective,
    TableComponent,
    FormsModule,
    EmptyStateComponent
  ],
})
export class AttractionsComponent {
  attractions$: Observable<Attraction[]>;
  loading$: Observable<boolean>;
  totalLength$: Observable<number>;
  page$: Observable<number>;
  perPage$: Observable<number>;
  cols$: Observable<number>;
  isMobile$: Observable<boolean>;

  searchQuery: string = '';
  sortField: string = 'name';
  isGridView: boolean = true;
  sortOrder: 'asc' | 'desc' = 'asc';

  columns: { displayedName: string, key: string }[] = [
    { displayedName: 'ID', key: 'id' },
    { displayedName: 'Name', key: 'name' },
    { displayedName: 'Details', key: 'detail' },
    { displayedName: 'Longitude', key: 'longitude' },
    { displayedName: 'Latitude', key: 'latitude' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private attractionsFacade: AttractionsFacade, private breakpointService: BreakpointService, private dialog: MatDialog) {
    this.attractions$ = this.attractionsFacade.attractions$;
    this.totalLength$ = this.attractionsFacade.totalLength$;
    this.perPage$ = this.attractionsFacade.perPage$;
    this.loading$ = this.attractionsFacade.loading$;
    this.page$ = this.attractionsFacade.page$;
    this.cols$ = this.breakpointService.getCols();
    this.isMobile$ = this.breakpointService.isMobile();
  }

  onPageChange(event: PageEvent) {
    this.attractionsFacade.handlePage(event.pageIndex + 1, event.pageSize);
  }

  onSortChange(sort: Sort) {
    this.attractionsFacade.setSort(sort.active, sort.direction);
  }

  onSortFieldChange(field: string) {
    this.sortField = field;
    this.attractionsFacade.setSort(field, this.sortOrder);
  }

  onSearch(value: string) {
    if (value !== this.searchQuery) {
      this.searchQuery = value;
      this.attractionsFacade.setSearch(value);
    }

  }

  toggleViewMode(): void {
    this.isGridView = !this.isGridView;
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.attractionsFacade.setSort(this.sortField, this.sortOrder);
  }

  onAddAttraction() {
    const dialogRef = this.dialog.open(AddAttractionDialogComponent, {
      width: '400px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'full-height-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attractionsFacade.addAttraction(result);
      }
    });
  }

  onUpdateAttraction(attraction: Attraction) {
    const dialogRef = this.dialog.open(UpdateAttractionDialogComponent, {
      width: '400px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'full-height-dialog',
      data: attraction
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedAttraction = { ...attraction, ...result };
        this.attractionsFacade.updateAttraction(updatedAttraction);
      }
    });
  }

  onDeleteAttraction(attraction: Attraction) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: { message: `Are you sure you want to delete ${attraction.name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attractionsFacade.deleteAttraction(attraction.id);
      }
    });
  }


}

