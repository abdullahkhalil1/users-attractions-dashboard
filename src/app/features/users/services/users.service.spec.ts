import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User, PaginatedUsers } from '../../../core/models/user.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are outstanding
  });

  // Mock data
  const mockUser: User = {
    id: '1',
    fname: 'John',
    lname: 'Doe',
    username: 'john@example.com'
  };

  const mockPaginatedUsers: PaginatedUsers = {
    data: [mockUser],
    total: 1,
    page: 1,
    per_page: 10,
    total_pages: 1
  };

  describe('getUsers', () => {
    it('should return users with default parameters', () => {
      service.getUsers().subscribe(response => {
        expect(response).toEqual(mockPaginatedUsers);
      });

      const req = httpMock.expectOne(
        `/users?search=&page=1&per_page=10&sort_column=id&sort_order=desc`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedUsers);
    });

    it('should return users with custom parameters', () => {
      service.getUsers('john', 2, 20, 'name', 'asc').subscribe(response => {
        expect(response).toEqual(mockPaginatedUsers);
      });

      const req = httpMock.expectOne(
        `/users?search=john&page=2&per_page=20&sort_column=name&sort_order=asc`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedUsers);
    });
  });

  describe('addUser', () => {
    it('should create a new user', () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };

      service.addUser(newUser).subscribe(response => {
        expect(response).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/users/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const updatedUser = { ...mockUser, name: 'John Updated' };

      service.updateUser(updatedUser).subscribe(response => {
        expect(response).toEqual(updatedUser);
      });

      const req = httpMock.expectOne('/users/update');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const userId = '1';

      service.deleteUser(userId).subscribe(response => {
        expect(response).toBe('User deleted successfully');
      });

      const req = httpMock.expectOne('/users/delete');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ id: userId });
      req.flush('User deleted successfully');
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', () => {
      const errorMessage = 'An error occurred';

      service.getUsers().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(
        `/users?search=&page=1&per_page=10&sort_column=id&sort_order=desc`
      );
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});