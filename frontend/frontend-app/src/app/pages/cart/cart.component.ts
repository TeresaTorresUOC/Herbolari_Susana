import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  items: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
    this.items = this.cartService.getItems();
  }
  getTotal(): number {
    return this.items.reduce(
      (total, item) => total + (item.price * (item.quantity || 1)),
      0
    );
  }
  
}