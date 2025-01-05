import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../../env';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    // private readonly BASE_URL = 'https://melivecode.com/api';
    private readonly BASE_URL = environment.BASE_URL; // Use the BASE_URL from environment

    constructor(
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) { }

    openErrorToast(errorMessage: string) {
        this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = sessionStorage.getItem('token');
        const expiresIn = sessionStorage.getItem('expiresIn');

        const isRelativeUrl = !request.url.startsWith('http');
        const fullUrl = isRelativeUrl ? `${this.BASE_URL}${request.url}` : request.url;

        let apiRequest = request.clone({
            url: fullUrl,
            setHeaders: {}
        });

        if (token) {
            const expirationDate = new Date(Number(expiresIn));
            if (expirationDate <= new Date()) {
                this.authService.logout();
                this.openErrorToast('Your token is expired please login again')
                return throwError(() => 'Token expired');
            }

            apiRequest = apiRequest.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(apiRequest).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    if (event.body.status === 'error') {
                        this.openErrorToast(event.body.message)
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An error occurred';

                if (error.error instanceof ErrorEvent) {
                    errorMessage = error.error.message;
                } else {
                    switch (error.status) {
                        case 400:
                            errorMessage = error.error?.message || 'Bad Request';
                            break;
                        case 401:
                            errorMessage = 'Unauthorized access';
                            sessionStorage.clear();
                            this.router.navigate(['/login']);
                            break;
                        case 403:
                            errorMessage = 'Access forbidden';
                            break;
                        case 404:
                            errorMessage = 'Resource not found';
                            break;
                        case 422:
                            errorMessage = 'Validation error';
                            break;
                        case 500:
                            errorMessage = 'Internal server error';
                            break;
                        case 503:
                            errorMessage = 'Service unavailable';
                            break;
                        default:
                            errorMessage = `Error: ${error.status} - ${error.message}`;
                    }
                }
                this.openErrorToast(errorMessage)
                return throwError(() => error);
            })
        );
    }
}