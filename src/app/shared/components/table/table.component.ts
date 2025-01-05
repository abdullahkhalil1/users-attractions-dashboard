import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatSortModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<T> {
  @Input() columns: { displayedName: string, key: string }[] = [];
  @Input() dataSource: T[] = [];
  @Input() hasActions: boolean = false;
  @Input() disableSorting?: boolean = false;
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();
  @ViewChild(MatSort) sort!: MatSort;

  onEdit(row: T) {
    this.edit.emit(row);
  }

  onDelete(row: T) {
    this.delete.emit(row);
  }

  onSortChange(sort: Sort) {
    this.sortChange.emit(sort);
  }

  get displayedColumns(): string[] {
    return this.columns.map(column => column.key).concat(this.hasActions ? 'actions' : []);
  }

  get defaultSortColumn(): string {
    return !this.disableSorting && this.columns.length > 0 ? this.columns[0].key : '';
  }
}
