import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  message: string = '';
  isRegistered: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registre correcte:', response);
        this.message = 'Usuari registrat correctament';
        this.isRegistered = true;

        const newUser = {
          id: response.userId,
          name: this.name,
          email: this.email,
          role: 'client'
        };

        this.authService.setUser(newUser);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 800);
      },
      error: (error) => {
        console.error('Error de registre:', error);
        this.message = error.error?.error || 'Error en el registre';
        this.isRegistered = false;
      }
    });
  }
}