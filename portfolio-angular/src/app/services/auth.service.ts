import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(username: string, password: string): Observable<{ logado: boolean }> {
    // Simula resposta de sucesso para qualquer usuário/senha
    return of({ logado: true });
  }

  verificarLogin(): Observable<{ logado: boolean }> {
    return of({ logado: true });
  }

  logout(): Observable<{ logado: boolean }> {
    return of({ logado: false });
  }
}