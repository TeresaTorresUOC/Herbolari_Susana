import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userMenuOpen = false;
  cartMenuOpen = false;
  searchOpen = false;

  searchTerm = '';

  authModalOpen = false;
  authMode: 'login' | 'register' = 'login';

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';

  authError = '';

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  /* MENUS */

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;

    this.cartMenuOpen = false;
    this.searchOpen = false;
  }

  toggleCartMenu(): void {
    this.cartMenuOpen = !this.cartMenuOpen;

    this.userMenuOpen = false;
    this.searchOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;

    this.userMenuOpen = false;
    this.cartMenuOpen = false;
  }

  /* AUTH MODAL */

  openAuthModal(mode: 'login' | 'register'): void {

    this.authMode = mode;
    this.authModalOpen = true;

    this.userMenuOpen = false;
    this.cartMenuOpen = false;
    this.searchOpen = false;

    this.authError = '';
  }

  closeAuthModal(): void {
    this.authModalOpen = false;
    this.authError = '';
  }

  /* LOGIN */

  login(): void {

    const data = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.login(data).subscribe({

      next: () => {

        this.closeAuthModal();

        this.loginEmail = '';
        this.loginPassword = '';
      },

      error: () => {
        this.authError = 'Email o contrasenya incorrectes';
      }

    });
  }

  /* REGISTER */

  register(): void {

    const data = {
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.register(data).subscribe({

      next: () => {

        this.authMode = 'login';

        this.authError = '';

        this.registerName = '';
        this.registerEmail = '';
        this.registerPassword = '';
      },

      error: () => {
        this.authError = 'No s’ha pogut crear el compte';
      }

    });
  }

  /* SEARCH */

  searchProducts(): void {

    const term = this.searchTerm.trim();

    if (!term) return;

    this.router.navigate(
      ['/products'],
      {
        queryParams: { search: term }
      }
    );

    this.searchOpen = false;
    this.searchTerm = '';
  }

  /* LOGOUT */

  logout(): void {

    this.authService.logout();

    this.userMenuOpen = false;
    this.authModalOpen = false;

    this.router.navigate(['/']);
  }

/*cart*/

  get cartItems() {
    return this.cartService.getItems();
  }

  get cartCount(): number {

    return this.cartItems.reduce((total, item: any) => {

      return total + (item.quantity || 1);

    }, 0);
  }

  get cartTotal(): number {

    return this.cartItems.reduce((total, item: any) => {

      return total + (
        Number(item.price || 0) * (item.quantity || 1)
      );

    }, 0);
  }

}