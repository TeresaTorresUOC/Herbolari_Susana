import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  message: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login correcte:', response);
        this.message = 'Login correcte';
        this.isLoggedIn = true;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 800);
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.message = error.error?.message || error.error?.error || 'Usuari o contrasenya incorrectes';
        this.isLoggedIn = false;
      }
    });
  }
}