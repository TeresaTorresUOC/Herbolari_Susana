import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

export interface OrderData {
  user_id: number;
  items: Product[];
  total: number;
  status: string;
  delivery_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderData): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }
}