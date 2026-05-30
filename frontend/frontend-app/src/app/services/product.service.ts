import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: number;

  is_new: number;
  is_eco: number;
  is_vegan: number;
  is_gluten_free: number;
  is_best_seller: number;

  subcategory?: string;
  stock:number;
  quantity?: number;
  category_name?: string;
  category_slug?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categorySlug}`);
  }

  addProduct(productData: FormData) {
    return this.http.post(`${this.apiUrl}`, productData);
  }
  updateProduct(id: number, productData: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }
  
  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}



