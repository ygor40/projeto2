import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  erro = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar(): void {

    this.erro = '';

    if (!this.username || !this.password) {
      this.erro = 'Informe usuário e senha.';
      return;
    }

    this.carregando = true;

    this.authService
      .login(this.username, this.password)
      .subscribe({
        next: (res) => {

          this.carregando = false;

          if (res.logado) {
            this.router.navigate(['/gestao']);
          } else {
            this.erro = 'Usuário ou senha incorretos.';
          }
        },

        error: (err) => {

          this.carregando = false;

          this.erro =
            err.error?.erro ||
            'Não foi possível realizar o login.';
        }
      });
  }
}