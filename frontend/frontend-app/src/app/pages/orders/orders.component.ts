import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user || !user.id) {
      this.loading = false;
      this.errorMessage = 'No hi ha cap usuari iniciat.';
      this.cdr.detectChanges();
      return;
    }

    this.http
      .get<any[]>(`http://localhost:3000/orders/user/${user.id}`)
      .subscribe({
        next: (data) => {
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
    this.http
      .put(`http://localhost:3000/orders/${orderId}/status`, { status: 'pagada' })
      .subscribe({
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
  
    this.http
      .delete(`http://localhost:3000/orders/${orderId}`)
      .subscribe({
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