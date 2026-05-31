import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent,FooterComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  groupedOrders: any[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
  
    console.log('USUARI EN ORDERS:', user);
  
    if (!user || !user.id) {
      this.loading = false;
      this.errorMessage = 'Has d’iniciar sessió per veure les teues comandes.';
      this.cdr.detectChanges();
      return;
    }
  
    this.orderService.getUserOrders(user.id).subscribe({
      next: (data) => {
        console.log('COMANDES DE L USUARI:', data);
  
        this.orders = data || [];
        this.groupOrders();
  
        this.loading = false;
        this.errorMessage = '';
  
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error carregant comandes:', err);
  
        this.loading = false;
        this.errorMessage = 'No s’han pogut carregar les comandes.';
  
        this.cdr.detectChanges();
      }
    });
  }
  completeOrder(orderId: number): void {
    this.orderService.updateOrderStatus(orderId, 'pagada').subscribe({
      next: () => {
        this.router.navigate(['/confirmation']);
      },
      error: (err) => {
        console.error('Error completant comanda:', err);
        this.errorMessage = 'No s’ha pogut completar la comanda.';
      }
    });
  }
  deleteOrder(orderId: number): void {
    if (!confirm('Segur que vols eliminar aquesta comanda?')) {
      return;
    }
  
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.groupedOrders = this.groupedOrders.filter(order => order.id !== orderId);
        this.orders = this.orders.filter(order => order.id !== orderId);
      },
      error: (err) => {
        console.error('Error eliminant comanda:', err);
        this.errorMessage = 'No s’ha pogut eliminar la comanda.';
      }
    });
  }
  
  editOrder(order: any): void {
    localStorage.setItem('editingOrder', JSON.stringify(order));
    this.router.navigate(['/subscription']);
  }
  payOrder(order: any): void {
    localStorage.setItem('orderToPay', JSON.stringify(order));
    this.router.navigate(['/checkout']);
  }

  groupOrders(): void {
    const map = new Map<number, any>();

    this.orders.forEach(row => {
      if (!map.has(row.id)) {
        map.set(row.id, {
          id: row.id,
          total: row.total,
          status: row.status,
          delivery_type: row.delivery_type,
          created_at: row.created_at,
        
          full_name: row.full_name,
          address: row.address,
          postal_code: row.postal_code,
          city: row.city,
          phone: row.phone,
          email: row.email,
          day: row.day,
          hour: row.hour,
          frequency: row.frequency,
          observations: row.observations,
        
          products: []
        });
      }

      if (row.product_id) {
        map.get(row.id).products.push({
          name: row.product_name,
          image: row.product_image,
          quantity: row.quantity,
          unit_price: row.unit_price
        });
      }
    });

    this.groupedOrders = Array.from(map.values());
  }
}