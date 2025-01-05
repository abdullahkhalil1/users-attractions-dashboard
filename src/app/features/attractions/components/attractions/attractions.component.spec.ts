import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AttractionsComponent } from './attractions.component';
import { AttractionsFacade } from '../../services/attractions.facade';
import { BreakpointService } from '../../../../shared/services/break-point.service';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { Attraction } from '../../../../core/models/attraction.modal';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddAttractionDialogComponent } from '../add-attraction-dialog/add-attraction-dialog.component';
import { UpdateAttractionDialogComponent } from '../update-attraction-dialog/update-attraction-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

describe('AttractionsComponent', () => {
  let component: AttractionsComponent;
  let fixture: ComponentFixture<AttractionsComponent>;
  let attractionsFacadeMock: jasmine.SpyObj<AttractionsFacade>;
  let breakpointServiceMock: jasmine.SpyObj<BreakpointService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  // Mock data
  const mockAttractions: Attraction[] = [
    {
      id: '1',
      name: 'Eiffel Tower',
      detail: 'Famous landmark',
      longitude: 2.2945,
      latitude: 48.8584,
      coverimage: 'image'
    },
    {
      id: '2',
      name: 'Big Ben',
      detail: 'Historic clock tower',
      longitude: -0.1276,
      latitude: 51.5007,
      coverimage: 'image'
    }
  ];

  beforeEach(async () => {
    // Create mock services
    attractionsFacadeMock = jasmine.createSpyObj('AttractionsFacade', [
      'handlePage',
      'setSort',
      'setSearch',
      'addAttraction',
      'updateAttraction',
      'deleteAttraction'
    ], {
      attractions$: new BehaviorSubject(mockAttractions),
      totalLength$: new BehaviorSubject(10),
      perPage$: new BehaviorSubject(5),
      loading$: new BehaviorSubject(false),
      page$: new BehaviorSubject(1)
    });

    breakpointServiceMock = jasmine.createSpyObj('BreakpointService', ['getCols', 'isMobile'], {
      getCols: () => of(4),
      isMobile: () => of(false)
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
        { provide: AttractionsFacade, useValue: attractionsFacadeMock },
        { provide: BreakpointService, useValue: breakpointServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct column definitions', () => {
    expect(component.columns).toEqual([
      { displayedName: 'ID', key: 'id' },
      { displayedName: 'Name', key: 'name' },
      { displayedName: 'Details', key: 'detail' },
      { displayedName: 'Longitude', key: 'longitude' },
      { displayedName: 'Latitude', key: 'latitude' }
    ]);
  });

  it('should initialize with default view and sort settings', () => {
    expect(component.isGridView).toBeTrue();
    expect(component.sortField).toBe('name');
    expect(component.sortOrder).toBe('asc');
  });

  describe('View and Sort Controls', () => {
    it('should toggle view mode', () => {
      const initialViewMode = component.isGridView;
      component.toggleViewMode();
      expect(component.isGridView).toBe(!initialViewMode);
    });

    it('should toggle sort order and update facade', () => {
      component.toggleSortOrder();
      expect(component.sortOrder).toBe('desc');
      expect(attractionsFacadeMock.setSort).toHaveBeenCalledWith('name', 'desc');
    });

    it('should handle sort field change', () => {
      component.onSortFieldChange('detail');
      expect(component.sortField).toBe('detail');
      expect(attractionsFacadeMock.setSort).toHaveBeenCalledWith('detail', 'asc');
    });
  });

  describe('Pagination and Search', () => {
    it('should handle page changes', () => {
      const pageEvent: PageEvent = {
        pageIndex: 1,
        pageSize: 10,
        length: 100
      };

      component.onPageChange(pageEvent);
      expect(attractionsFacadeMock.handlePage).toHaveBeenCalledWith(2, 10);
    });

    it('should handle sort changes', () => {
      const sortEvent: Sort = {
        active: 'name',
        direction: 'desc'
      };

      component.onSortChange(sortEvent);
      expect(attractionsFacadeMock.setSort).toHaveBeenCalledWith('name', 'desc');
    });

    it('should handle search changes', () => {
      const searchQuery = 'Tower';
      component.onSearch(searchQuery);
      expect(attractionsFacadeMock.setSearch).toHaveBeenCalledWith(searchQuery);
    });
  });

  describe('Dialog Operations', () => {
    it('should open add attraction dialog and handle result', fakeAsync(() => {
      const mockNewAttraction = {
        id: '1',
        name: 'New Attraction',
        detail: 'New Details',
        longitude: 0,
        latitude: 0,
        coverimage: 'image'
      };

      const mockDialogRef = {
        afterClosed: () => of(mockNewAttraction)
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onAddAttraction();
      tick();

      expect(dialogMock.open).toHaveBeenCalledWith(AddAttractionDialogComponent, {
        width: '400px',
        height: '100vh',
        position: { right: '0' },
        panelClass: 'full-height-dialog'
      });
      expect(attractionsFacadeMock.addAttraction).toHaveBeenCalledWith(mockNewAttraction);
    }));

    it('should open update attraction dialog and handle result', fakeAsync(() => {
      const mockAttraction = mockAttractions[0];
      const mockUpdate = { name: 'Updated Name' };
      const mockDialogRef = {
        afterClosed: () => of(mockUpdate)
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onUpdateAttraction(mockAttraction);
      tick();

      expect(dialogMock.open).toHaveBeenCalledWith(UpdateAttractionDialogComponent, {
        width: '400px',
        height: '100vh',
        position: { right: '0' },
        panelClass: 'full-height-dialog',
        data: mockAttraction
      });
      expect(attractionsFacadeMock.updateAttraction).toHaveBeenCalledWith({
        ...mockAttraction,
        ...mockUpdate
      });
    }));

    it('should open delete confirmation dialog and handle confirmation', fakeAsync(() => {
      const mockAttraction = mockAttractions[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onDeleteAttraction(mockAttraction);
      tick();

      expect(dialogMock.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        width: '30%',
        data: { message: `Are you sure you want to delete ${mockAttraction.name}?` }
      });
      expect(attractionsFacadeMock.deleteAttraction).toHaveBeenCalledWith(mockAttraction.id);
    }));

    it('should not delete attraction when confirmation is cancelled', fakeAsync(() => {
      const mockAttraction = mockAttractions[0];
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      dialogMock.open.and.returnValue(mockDialogRef as any);

      component.onDeleteAttraction(mockAttraction);
      tick();

      expect(attractionsFacadeMock.deleteAttraction).not.toHaveBeenCalled();
    }));
  });

  describe('Responsive Behavior', () => {
    it('should get columns from breakpoint service', (done) => {
      component.cols$.subscribe(cols => {
        expect(cols).toBe(4);
        done();
      });
    });

    it('should get mobile status from breakpoint service', (done) => {
      component.isMobile$.subscribe(isMobile => {
        expect(isMobile).toBeFalse();
        done();
      });
    });
  });
});