import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AttractionsService } from './attractions.service';
import { Attraction, PaginatedAttractions } from '../../../core/models/attraction.modal';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AttractionsService', () => {
  let service: AttractionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AttractionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AttractionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are outstanding
  });

  // Mock data
  const mockAttraction: Attraction = {
    id: '1',
    name: 'Eiffel Tower',
    detail: 'A famous attraction in Paris.',
    coverimage: 'imagepath',
    latitude: -24.26,
    longitude: -63.6
  };

  const mockPaginatedAttractions: PaginatedAttractions = {
    data: [mockAttraction],
    total: 1,
    page: 1,
    per_page: 10,
    total_pages: 1,
  };

  describe('getAttractions', () => {
    it('should return attractions with default parameters', () => {
      service.getAttractions().subscribe((response) => {
        expect(response).toEqual(mockPaginatedAttractions);
      });

      const req = httpMock.expectOne(
        `/attractions?search=&page=1&per_page=10&sort_column=id&sort_order=desc`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedAttractions);
    });

    it('should return attractions with custom parameters', () => {
      service
        .getAttractions('tower', 2, 5, 'name', 'asc')
        .subscribe((response) => {
          expect(response).toEqual(mockPaginatedAttractions);
        });

      const req = httpMock.expectOne(
        `/attractions?search=tower&page=2&per_page=5&sort_column=name&sort_order=asc`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedAttractions);
    });
  });

  describe('addAttraction', () => {
    it('should create a new attraction', () => {
      const newAttraction: Attraction = { id: '2', name: 'Louvre Museum', detail: 'A world-famous museum.', coverimage: 'imagepath', latitude: 24.2, longitude: 63 };

      service.addAttraction(newAttraction).subscribe((response) => {
        expect(response).toEqual(mockAttraction);
      });

      const req = httpMock.expectOne('/auth/attractions/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newAttraction);
      req.flush(mockAttraction);
    });
  });

  describe('updateAttraction', () => {
    it('should update an existing attraction', () => {
      const updatedAttraction = { ...mockAttraction, name: 'Updated Tower' };

      service.updateAttraction(updatedAttraction).subscribe((response) => {
        expect(response).toEqual(updatedAttraction);
      });

      const req = httpMock.expectOne('/auth/attractions/update');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedAttraction);
      req.flush(updatedAttraction);
    });
  });

  describe('deleteAttraction', () => {
    it('should delete an attraction', () => {
      const attractionId = '1';

      service.deleteAttraction(attractionId).subscribe((response) => {
        expect(response).toBe('Attraction deleted successfully');
      });

      const req = httpMock.expectOne('/attractions/delete');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ id: attractionId });
      req.flush('Attraction deleted successfully');
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', () => {
      const errorMessage = 'An error occurred';

      service.getAttractions().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpMock.expectOne(
        `/attractions?search=&page=1&per_page=10&sort_column=id&sort_order=desc`
      );
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
