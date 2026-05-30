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

  private apiUrl = 'https://herbolari-susana.onrender.com/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderData): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrderById(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, { status });
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }
}