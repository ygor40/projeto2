import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {

  private observer?: IntersectionObserver;
  private routerSubscription?: Subscription;

  private cardAtual?: HTMLElement;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {

    /*
     * Configura os elementos da primeira página.
     */
    setTimeout(() => {
      this.configurarReveal();
    }, 150);

    /*
     * Toda vez que mudar de página no Angular,
     * procura novamente os elementos .reveal.
     */
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        setTimeout(() => {
          this.configurarReveal();
        }, 150);

      });
  }


  /* =========================================
     LUZ QUE SEGUE O CURSOR
  ========================================= */

  @HostListener('document:mousemove', ['$event'])
  moverMouse(event: MouseEvent): void {

    const glow =
      document.querySelector('.cursor-glow') as HTMLElement;

    if (glow) {

      glow.style.left =
        `${event.clientX}px`;

      glow.style.top =
        `${event.clientY}px`;
    }


    /*
     * Verifica se o mouse está em cima
     * de um card.
     */
    const elemento =
      event.target as HTMLElement;

    const card =
      elemento.closest(
        'mat-card, .mini-card'
      ) as HTMLElement | null;


    /*
     * Se saiu do card anterior,
     * volta ele à posição normal.
     */
    if (this.cardAtual && this.cardAtual !== card) {

      this.resetarCard(
        this.cardAtual
      );

      this.cardAtual = undefined;
    }


    if (!card) {
      return;
    }

    this.cardAtual = card;

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const centroX =
      rect.width / 2;

    const centroY =
      rect.height / 2;


    /*
     * Limita a rotação para não ficar exagerada.
     */
    const rotateY =
      ((x - centroX) / centroX) * 3.5;

    const rotateX =
      ((centroY - y) / centroY) * 3.5;


    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
      scale(1.01)
    `;


    /*
     * Posição do brilho interno.
     */
    card.style.setProperty(
      '--mouse-x',
      `${x}px`
    );

    card.style.setProperty(
      '--mouse-y',
      `${y}px`
    );
  }


  /* =========================================
     QUANDO O MOUSE SAI
  ========================================= */

  @HostListener('document:mouseout', ['$event'])
  sairMouse(event: MouseEvent): void {

    const destino =
      event.relatedTarget as HTMLElement | null;

    /*
     * Só reseta completamente quando
     * o cursor realmente sai da página.
     */
    if (!destino && this.cardAtual) {

      this.resetarCard(
        this.cardAtual
      );

      this.cardAtual = undefined;
    }
  }


  /* =========================================
     RESET DO CARD
  ========================================= */

  private resetarCard(
    card: HTMLElement
  ): void {

    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
      scale(1)
    `;
  }


  /* =========================================
     REVEAL AO ROLAR
  ========================================= */

  private configurarReveal(): void {

    /*
     * Desliga o observer antigo antes
     * de criar um novo.
     */
    if (this.observer) {
      this.observer.disconnect();
    }


    const elementos =
      document.querySelectorAll('.reveal');


    this.observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'reveal-visivel'
              );

              /*
               * Depois que apareceu,
               * não precisa observar novamente.
               */
              this.observer?.unobserve(
                entry.target
              );
            }

          });

        },

        {
          threshold: 0.12
        }
      );


    elementos.forEach(elemento => {

      this.observer?.observe(
        elemento
      );

    });
  }


  /* =========================================
     LIMPEZA
  ========================================= */

  ngOnDestroy(): void {

    this.observer?.disconnect();

    this.routerSubscription?.unsubscribe();

  }
}