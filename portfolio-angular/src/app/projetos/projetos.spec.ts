import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string | null;
  ano: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  private url = 'https://laughing-space-succotash-pjv6p6qv654v377gw-3000.app.github.dev/';

  constructor(private http: HttpClient) { }

  getProjetos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.url);
  }
}