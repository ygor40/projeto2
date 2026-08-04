import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {
  TecnologiaService,
  Tecnologia
} from '../services/tecnologia';

@Component({
  selector: 'app-catalogo',
  imports: [MatCardModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  private service = inject(TecnologiaService);

  tecnologias: Tecnologia[] = [];
  carregando = true;
  erro = '';

  busca = '';

  ngOnInit() {
    this.service.listar().subscribe({
      next: (lista) => {
        this.tecnologias = lista;
        this.carregando = false;
      },

      error: () => {
        this.erro = 'Falha ao carregar o catálogo.';
        this.carregando = false;
      }
    });
  }

  get tecnologiasFiltradas() {
    const termo = this.busca.toLowerCase().trim();

    if (!termo) {
      return this.tecnologias;
    }

    return this.tecnologias.filter(t =>
      t.nome.toLowerCase().includes(termo) ||
      t.categoria.toLowerCase().includes(termo)
    );
  }
}