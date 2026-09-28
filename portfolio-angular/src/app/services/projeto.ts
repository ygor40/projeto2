import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github?: string;
  ano: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  // URL atualizada para apontar para a API em Node (Porta 3000)
  private apiUrl = 'https://laughing-space-succotash-pjv6p6qv654v377gw-3000.app.github.dev/api/projetos';

  constructor(private http: HttpClient) {}

  // Métodos de listagem
  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.apiUrl);
  }

  getProjetos(): Observable<Projeto[]> {
    return this.listar();
  }

  // Métodos de criação
  criar(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(this.apiUrl, projeto);
  }

  criarProjeto(projeto: Projeto): Observable<Projeto> {
    return this.criar(projeto);
  }

  // Métodos de edição
  atualizar(id: number, projeto: Projeto): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.apiUrl}?id=${id}`, projeto);
  }

  atualizarProjeto(id: number, projeto: Projeto): Observable<Projeto> {
    return this.atualizar(id, projeto);
  }

  // Métodos de exclusão
  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }

  deletarProjeto(id: number): Observable<any> {
    return this.deletar(id);
  }

  excluir(id: number): Observable<any> {
    return this.deletar(id);
  }
}