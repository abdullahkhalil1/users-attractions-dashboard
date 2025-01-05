// import { TestBed } from '@angular/core/testing';

// import { PetSalesService } from './pet-sales.service';

// describe('PetSalesService', () => {
//   let service: PetSalesService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(PetSalesService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { PetSalesService } from './pet-sales.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PetSalesService', () => {
  let service: PetSalesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PetSalesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PetSalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no outstanding HTTP requests
  });

  // Mock Data
  const mockWeeklySalesData = {
    series: [
      { name: 'Dogs', data: [10, 20, 30, 40, 50, 60, 70] },
      { name: 'Cats', data: [5, 15, 25, 35, 45, 55, 65] }
    ],
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const mockDailySalesData = {
    series: [
      { name: 'Dogs', data: [30] },
      { name: 'Cats', data: [20] }
    ],
    categories: ['Today']
  };

  describe('getWeeklySales', () => {
    it('should return weekly sales data for a given date', () => {
      const date = '2025-01-01';

      service.getWeeklySales(date).subscribe(response => {
        expect(response).toEqual(mockWeeklySalesData);
      });

      const req = httpMock.expectOne(`/pets/7days/${date}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWeeklySalesData);
    });
  });

  describe('getDailySales', () => {
    it('should return daily sales data for a given date', () => {
      const date = '2025-01-02';

      service.getDailySales(date).subscribe(response => {
        expect(response).toEqual(mockDailySalesData);
      });

      const req = httpMock.expectOne(`/pets/${date}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDailySalesData);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors for getWeeklySales', () => {
      const date = '2025-01-01';
      const errorMessage = 'Error fetching weekly sales data';

      service.getWeeklySales(date).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`/pets/7days/${date}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP errors for getDailySales', () => {
      const date = '2025-01-02';
      const errorMessage = 'Error fetching daily sales data';

      service.getDailySales(date).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`/pets/${date}`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});


