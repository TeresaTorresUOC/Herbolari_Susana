import { Injectable } from '@angular/core';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: Product[] = [];

  addToCart(product: Product): void {

    const existingProduct = this.items.find(
      item => item.id === product.id
    );
  
    if (existingProduct) {
  
      existingProduct.quantity =
        (existingProduct.quantity || 1) + 1;
  
    } else {
  
      this.items.push({
        ...product,
        quantity: 1
      });
  
    }
  
    console.log('Carret actual:', this.items);
  }
  getTotal(): number {
    return this.items.reduce(
      (total, item) =>
        total + (item.price * (item.quantity || 1)),
      0
    );
  }

  getItems(): Product[] {
    return this.items;
  }

  clearCart(): void {
    this.items = [];
  }

  removeItem(productId: number): void {
    this.items = this.items.filter(
      item => item.id !== productId
    );
  }
}