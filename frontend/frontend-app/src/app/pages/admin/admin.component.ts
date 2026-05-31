import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  products: Product[] = [];
  orders: any[] = [];
groupedOrders: any[] = [];
orderFilter: string = 'all';

groupOrders(): void {
  const grouped = this.orders.reduce((acc: any[], row: any) => {
    let order = acc.find(item => item.id === row.id);

    if (!order) {
      order = {
        id: row.id,
        user_name: row.user_name,
        user_email: row.user_email,
        created_at: row.created_at,
        delivery_type: row.delivery_type,
        status: row.status,
        total: row.total,
      
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
      };

      acc.push(order);
    }

    if (row.product_id) {
      order.products.push({
        product_name: row.product_name,
        product_image: row.product_image,
        quantity: row.quantity,
        unit_price: row.unit_price
      });
    }

    return acc;
  }, []);

  this.groupedOrders = grouped;
}

get filteredGroupedOrders() {
  if (this.orderFilter === 'normal') {
    return this.groupedOrders.filter(order => order.delivery_type !== 'subscripcio');
  }

  if (this.orderFilter === 'subscription') {
    return this.groupedOrders.filter(order => order.delivery_type === 'subscripcio');
  }

  return this.groupedOrders;
}
  view: string = 'products';

  editingProductId: number | null = null;
  selectedImage: File | null = null;

  subcategoriesByCategory: any = {
    1: [
      { label: 'Infusions', value: 'infusions' },
      { label: 'Relax', value: 'relax' },
      { label: 'Circulatoris', value: 'circulatoris' },
      { label: 'Vitamines', value: 'vitamines' },
      { label: 'Respiratoris', value: 'respiratoris' },
      { label: 'Hormonals', value: 'hormonals' },
      { label: 'hepatic', value: 'hepatic' }
    ],
    2: [
      { label: 'Farines', value: 'farines' },
      { label: 'Llegums', value: 'llegums' },
      { label: 'Begudes', value: 'begudes' },
      { label: 'Cereals', value: 'cereals' },
      { label: 'Carn vegetal', value: 'carn-vegetal' }
    ],
    3: [
      { label: 'Facial', value: 'facial' },
      { label: 'Corporal', value: 'corporal' },
      { label: 'Cabell', value: 'cabell' },
      { label: 'Higiene', value: 'higiene' }
    ],
    4: [
      { label: 'Neteja', value: 'neteja' },
      { label: 'Ambientadors', value: 'ambientadors' },
      { label: 'Accessoris', value: 'accessoris' }
    ],
    5: [
      { label: 'Gats', value: 'gats' },
      { label: 'Gossos', value: 'gossos' },
      { label: 'Suplements', value: 'suplements' }
    ]
  };
  
  onCategoryChange(): void {
    this.newProduct.subcategory = '';
  }

  newProduct = this.getEmptyProduct();

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  getEmptyProduct() {
    return {
      name: '',
      description: '',
      price: 0,
      image: '',
      category_id: 1,
      subcategory:'',
      stock:0,
      is_new: false,
      is_eco: false,
      is_vegan: false,
      is_gluten_free: false,
      is_best_seller: false
    };
  }

  loadProducts(goToProducts: boolean = false): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
  
        if (goToProducts) {
          this.view = 'products';
        }
      },
      error: (error) => {
        console.error('Error carregant productes:', error);
      }
    });
  }

  openAddProduct(): void {
    this.resetForm();
    this.view = 'add';
  }

  editProduct(product: any): void {
    this.editingProductId = product.id;
    this.selectedImage = null;
    this.view = 'add';

    this.newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category_id: product.category_id,
      subcategory: product.subcategory || '',
      stock: product.stock || 0,
      is_new: !!product.is_new,
      is_eco: !!product.is_eco,
      is_vegan: !!product.is_vegan,
      is_gluten_free: !!product.is_gluten_free,
      is_best_seller: !!product.is_best_seller
    };
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  addProduct(): void {
    const formData = new FormData();

    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('price', String(this.newProduct.price));
    formData.append('category_id', String(this.newProduct.category_id));
    formData.append('subcategory', this.newProduct.subcategory);
    formData.append('stock', String(this.newProduct.stock));
    formData.append('currentImage', this.newProduct.image);

    formData.append('is_new', String(this.newProduct.is_new ? 1 : 0));
    formData.append('is_eco', String(this.newProduct.is_eco ? 1 : 0));
    formData.append('is_vegan', String(this.newProduct.is_vegan ? 1 : 0));
    formData.append('is_gluten_free', String(this.newProduct.is_gluten_free ? 1 : 0));
    formData.append('is_best_seller', String(this.newProduct.is_best_seller ? 1 : 0));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, formData).subscribe({
        next: () => {
          alert('Producte actualitzat correctament');
          this.loadProducts();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error actualitzant producte:', error);
        }
      });
    } else {
      this.productService.addProduct(formData).subscribe({
        next: () => {
          alert('Producte afegit correctament');
          this.loadProducts();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error afegint producte:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.editingProductId = null;
    this.selectedImage = null;
    this.newProduct = this.getEmptyProduct();
  }
  loadOrders(): void {
    console.log('Botó comandes clicat');
    this.view = 'orders';
  
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        console.log('Comandes rebudes:', data);
        this.orders = data;
        this.groupOrders();
      },
      error: (error) => {
        console.error('Error carregant comandes:', error);
        alert('No s’han pogut carregar les comandes');
      }
    });
  }
  
  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        alert('Estat actualitzat');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error actualitzant estat:', error);
      }
    });
  }
  
  deleteOrder(orderId: number): void {
    if (!confirm('Segur que vols eliminar aquesta comanda?')) return;
  
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        alert('Comanda eliminada');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error eliminant comanda:', error);
      }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Segur que vols eliminar aquest producte?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        alert('Producte eliminat');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error eliminant producte:', error);
      }
    });
  }
}