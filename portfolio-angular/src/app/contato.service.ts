import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NovoContato {
  nome: string;
  email: string;
  mensagem: string;
}

export interface RespostaContato {
  sucesso: boolean;
  id: number;
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  private http = inject(HttpClient);

  private url =
    'https://laughing-space-succotash-pjv6p6qv654v377gw-8000.app.github.dev/api/contato.php';

  enviar(dados: NovoContato): Observable<RespostaContato> {
    return this.http.post<RespostaContato>(this.url, dados);
  }
}