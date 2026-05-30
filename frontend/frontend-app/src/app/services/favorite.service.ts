import { Injectable } from '@angular/core';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private storageKey = 'favorites';

  getFavorites(): Product[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  isFavorite(productId: number): boolean {
    return this.getFavorites().some(product => product.id === productId);
  }

  toggleFavorite(product: Product): void {
    const favorites = this.getFavorites();
    const exists = favorites.some(item => item.id === product.id);

    const updatedFavorites = exists
      ? favorites.filter(item => item.id !== product.id)
      : [...favorites, product];

    localStorage.setItem(this.storageKey, JSON.stringify(updatedFavorites));
  }

  removeFavorite(productId: number): void {
    const favorites = this.getFavorites().filter(item => item.id !== productId);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}