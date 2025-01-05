import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attraction, PaginatedAttractions } from '../../../core/models/attraction.modal';

@Injectable({
    providedIn: 'root'
})
export class AttractionsService {
    constructor(private http: HttpClient) { }

    getAttractions(search: string = '', page: number = 1, per_page: number = 10, sort_column: string = 'id', sort_order: string = 'desc'): Observable<any> {
        let params = new HttpParams()
            .set('search', search)
            .set('page', page.toString())
            .set('per_page', per_page.toString())
            .set('sort_column', sort_column)
            .set('sort_order', sort_order);

        return this.http.get<PaginatedAttractions>(`/attractions`, { params });
    }

    addAttraction(attraction: Attraction): Observable<Attraction> {
        return this.http.post<Attraction>(`/auth/attractions/create`, attraction);
    }

    updateAttraction(attraction: Attraction): Observable<Attraction> {
        return this.http.put<Attraction>(`/auth/attractions/update`, attraction);
    }

    deleteAttraction(id: string): Observable<string> {
        const options = {
            body: { id }
        };
        return this.http.request<string>('delete', `/attractions/delete`, options);
    }
}