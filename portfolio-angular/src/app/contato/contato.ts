import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contato',

  imports: [
    ReactiveFormsModule,
    MatCardModule
  ],

  templateUrl: './contato.html',
  styleUrl: './contato.css'
})
export class Contato {

  private fb = inject(FormBuilder);
  private service = inject(ContatoService);

  enviando = false;
  sucesso = '';
  erro = '';

  form = this.fb.nonNullable.group({

    nome: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    mensagem: [
      '',
      [
        Validators.required,
        Validators.minLength(10)
      ]
    ]

  });

  onSubmit(): void {

    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;

    this.service
      .enviar(this.form.getRawValue())
      .subscribe({

        next: (resposta) => {

          this.sucesso = resposta.mensagem;

          this.form.reset();

          this.enviando = false;
        },

        error: (erro) => {

          if (erro.error?.erros) {

            this.erro =
              erro.error.erros.join(' ');

          } else {

            this.erro =
              'Não foi possível enviar. Tente novamente.';
          }

          this.enviando = false;
        }

      });
  }
}