import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  items: Product[] = [];
  total: number = 0;
  message: string = '';
  deliveryType: string = 'recollida';
  isSubmitting: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.items.reduce((sum, item) => {
      return sum + Number(item.price);
    }, 0);
  }

  confirmOrder(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.message = 'Has d’iniciar sessió abans de confirmar la comanda';
      return;
    }

    if (this.items.length === 0) {
      this.message = 'El carret està buit';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const orderData = {
      user_id: user.id,
      items: this.items,
      total: this.total,
      status: 'pending',
      delivery_type: this.deliveryType
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Comanda creada:', response);
        this.cartService.clearCart();
        this.items = [];
        this.total = 0;
        this.isSubmitting = false;
        this.router.navigate(['/confirmation']);
      },
      error: (error) => {
        console.error('Error en crear la comanda:', error);
        this.message = error.error?.error || 'Error en confirmar la comanda';
        this.isSubmitting = false;
      }
    });
  }
}