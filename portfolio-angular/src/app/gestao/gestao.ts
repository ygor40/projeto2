import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Projeto,
  ProjetoService
} from '../services/projeto';

@Component({
  selector: 'app-gestao',

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})
export class Gestao implements OnInit {

  private service = inject(ProjetoService);

  projetos: Projeto[] = [];

  carregando = true;
  salvando = false;

  erro = '';

  editandoId: number | null = null;

  form = new FormGroup({

    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),

    descricao: new FormControl('', {
      nonNullable: true
    }),

    tecnologias: new FormControl('', {
      nonNullable: true
    }),

    link_github: new FormControl('', {
      nonNullable: true
    }),

    ano: new FormControl(2026, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })

  });


  ngOnInit(): void {
    this.carregar();
  }


  carregar(): void {

    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({

      next: (lista) => {

        this.projetos = lista;

        this.carregando = false;
      },

      error: () => {

        this.erro =
          'Não foi possível carregar os projetos.';

        this.carregando = false;
      }

    });
  }


  editar(projeto: Projeto): void {

    this.editandoId =
      projeto.id ?? null;

    this.form.patchValue({

      nome: projeto.nome,

      descricao:
        projeto.descricao ?? '',

      tecnologias:
        projeto.tecnologias ?? '',

      link_github:
        projeto.link_github ?? '',

      ano:
        projeto.ano

    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  salvar(): void {

    this.erro = '';

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.salvando = true;

    const dados: Projeto = {
      nome: this.form.controls.nome.value,
      descricao: this.form.controls.descricao.value,
      tecnologias: this.form.controls.tecnologias.value,
      link_github: this.form.controls.link_github.value,
      ano: this.form.controls.ano.value
    };


    const requisicao =
      this.editandoId !== null

        ? this.service.atualizar(
            this.editandoId,
            dados
          )

        : this.service.criar(
            dados
          );


    requisicao.subscribe({

      next: () => {

        this.salvando = false;

        this.cancelarEdicao();

        this.carregar();
      },

      error: () => {

        this.salvando = false;

        this.erro =
          'Não foi possível salvar o projeto.';
      }

    });
  }


  excluir(projeto: Projeto): void {

    if (!projeto.id) {
      return;
    }

    const confirmar = confirm(
      `Excluir o projeto "${projeto.nome}"?`
    );

    if (!confirmar) {
      return;
    }


    this.service
      .excluir(projeto.id)
      .subscribe({

        next: () => {

          this.projetos =
            this.projetos.filter(
              item =>
                item.id !== projeto.id
            );

        },

        error: () => {

          this.erro =
            'Não foi possível excluir o projeto.';

        }

      });
  }


  cancelarEdicao(): void {

    this.editandoId = null;

    this.form.reset({

      nome: '',

      descricao: '',

      tecnologias: '',

      link_github: '',

      ano: 2026

    });
  }
}