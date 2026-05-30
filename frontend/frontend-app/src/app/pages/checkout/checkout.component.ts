import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  items: Product[] = [];
  total = 0;
  message = '';
  deliveryType = 'recollida';
  isSubmitting = false;
  shippingCost = 0;

  

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.calculateTotal();
  }

  get subtotal(): number {
    return this.items.reduce((sum, item: any) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }

  get finalTotal(): number {
    return this.subtotal + this.shippingCost;
  }

  formatPrice(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }

  calculateTotal(): void {
    this.total = this.subtotal;
  }


  confirmOrder(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.message = 'Has d’iniciar sessió abans de confirmar la comanda';
      return;
    }

    if (this.items.length === 0) {
      this.message = 'No hi ha productes en aquesta comanda';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;



    const orderData = {
      user_id: user.id,
      items: this.items,
      total: this.finalTotal,
      status: 'pagada',
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