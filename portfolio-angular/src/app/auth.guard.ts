import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verificarLogin().pipe(

    map(res => {

      if (res.logado) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    }),

    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })

  );
};