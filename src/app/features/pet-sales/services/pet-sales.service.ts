// pet-sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PetSalesData {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PetSalesService {
  constructor(private http: HttpClient) { }

  getWeeklySales(date: string): Observable<any> {
    return this.http.get<any>(`/pets/7days/${date}`);
  }

  getDailySales(date: string): Observable<any> {
    return this.http.get<any>(`/pets/${date}`);
  }
}