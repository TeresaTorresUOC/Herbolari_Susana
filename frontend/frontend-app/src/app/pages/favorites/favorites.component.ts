import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {

  constructor(
    public favoriteService: FavoriteService,
    private cartService: CartService
  ) {}

  get favorites() {
    return this.favoriteService.getFavorites();
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert('Producte afegit al carret');
  }

  removeFavorite(productId: number): void {
    this.favoriteService.removeFavorite(productId);
  }
}