import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { OrderService } from '../../services/order.service';
import { AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

  fullName = '';
  address = '';
  postalCode = '';
  city = '';
  phone = '';
  email = '';
  day = '';
  hour = '';
  frequency = 'setmana';
  observations = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}

  get cartItems() {
    return this.cartService.getItems();
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item: any) => {
      return total + Number(item.price || 0) * (item.quantity || 1);
    }, 0);
  }
  get cartCount(): number {
    return this.cartItems.reduce((total, item: any) => {
      return total + (item.quantity || 1);
    }, 0);
  }
  saveSubscription(): void {
    const user = this.authService.getCurrentUser();
  
    if (!user || !user.id) {
      alert('Has d’iniciar sessió per guardar una subscripció');
      return;
    }
  
    if (this.cartItems.length === 0) {
      alert('El carret està buit');
      return;
    }
  
    const subscriptionData = {
      user_id: user.id,
      items: this.cartItems,
      total: this.cartTotal,
      status: 'programada',
      delivery_type: 'subscripcio',
    
      full_name: this.fullName,
      address: this.address,
      postal_code: this.postalCode,
      city: this.city,
      phone: this.phone,
      email: this.email,
      day: this.day,
      hour: this.hour,
      frequency: this.frequency,
      observations: this.observations
    };
  
    console.log('DADES QUE ENVIE:', subscriptionData);
  
    this.orderService.createOrder(subscriptionData).subscribe({
      next: (res) => {
        console.log('RESPOSTA BACKEND:', res);
        alert('Subscripció guardada correctament');
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('ERROR BACKEND:', err);
        alert(err.error?.error || 'No s’ha pogut guardar la subscripció');
      }
    });
  }
 
}