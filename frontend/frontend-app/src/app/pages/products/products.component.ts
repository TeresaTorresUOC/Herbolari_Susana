import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { FavoriteService } from '../../services/favorite.service';


type CategoryConfig = {
  title: string;
  heroImage: string;
  subcategories: string[];
};

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HeaderComponent,FormsModule, FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedQuantities: { [productId: number]: number } = {};

  visibleCount = 8;

  currentCategory = '';
  currentSubcategory = '';
  searchTerm = '';
  filtersOpen = false;

  categoryTitle = 'Productes';
  heroImage = 'assets/hero_productes.webp';
  subcategories: string[] = [];

  categoryConfig: Record<string, CategoryConfig> = {
    fitoterapia: {
      title: 'Fitoteràpia',
      heroImage: 'assets/hero_productes.webp',
      subcategories: [
        'infusions',
        'relax',
        'circulatoris',
        'vitamines',
        'respiratoris',
        'hormonals',
        'hepatic'
      ]
    },
  
    alimentacio: {
      title: 'Alimentació',
      heroImage: 'assets/hero_productes.webp',
      subcategories: [
        'farines',
        'llegums',
        'begudes',
        'cereals',
        'carn-vegetal'
      ]
    },
  
    cosmetica: {
      title: 'Cosmètica',
      heroImage: 'assets/hero_productes.webp',
      subcategories: [
        'facial',
        'corporal',
        'cabell',
        'higiene'
      ]
    },
  
    llar: {
      title: 'Llar',
      heroImage: 'assets/hero_productes.webp',
      subcategories: [
        'neteja',
        'ambientadors',
        'accessoris'
      ]
    },
  
    mascotes: {
      title: 'Mascotes',
      heroImage: 'assets/hero_productes.webp',
      subcategories: [
        'gats',
        'gossos',
        'suplements'
      ]
    }
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    public favoriteService: FavoriteService
    
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
    });
  
    this.route.paramMap.subscribe(params => {
  
      const category = params.get('category');
  
      if (category) {
  
        this.currentCategory = category;
  
        const config = this.categoryConfig[category];
  
        if (config) {
          this.categoryTitle = config.title;
          this.heroImage = config.heroImage;
          this.subcategories = config.subcategories;
          this.currentSubcategory = '';
        }
  
        this.loadProducts(category);
  
      } else {
  
        this.categoryTitle = 'Productes';
        this.heroImage = 'assets/hero_productes.webp';
        this.subcategories = [];
        this.currentSubcategory = '';
  
        this.loadAllProducts();
      }
    });
  }
  applyFilters(): void {

    this.filteredProducts = this.products.filter(product => {
  
      const matchesSubcategory =
        !this.currentSubcategory ||
        product.subcategory === this.currentSubcategory;
  
      const matchesSearch =
        !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
  
      return matchesSubcategory && matchesSearch;
    });
  }

  loadProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error carregant productes:', error);
      }
    });
  }
  
  loadAllProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error carregant tots els productes:', error);
      }
    });
    
  }
  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }
  
  selectSubcategory(subcategory: string): void {
    this.currentSubcategory = subcategory;
    this.applySubcategoryFilter();
  }

  applySubcategoryFilter(): void {
    this.applyFilters();
  }
  clearSubcategoryFilter(): void {
    this.currentSubcategory = '';
    this.filteredProducts = [...this.products];
  }
  
  loadMore(): void {
    this.visibleCount += 8;
  }
  getQuantityOptions(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }
  toggleFavorite(product: Product): void {
    this.favoriteService.toggleFavorite(product);
  }
  
  isFavorite(productId: number): boolean {
    return this.favoriteService.isFavorite(productId);
  }
  
  addToCart(product: Product): void {
    const quantity = this.selectedQuantities[product.id] || 1;
  
    if (product.stock <= 0) {
      alert('Aquest producte està fora d’estoc');
      return;
    }
  
    this.cartService.addToCart({
      ...product,
      quantity
    });
  
    alert(`${product.name} afegit al carret`);
  }
}