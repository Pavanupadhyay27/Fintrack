import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const userId = auth.getCurrentUserId();
  if (userId) {
    return true;
  }

  const user = await auth.getUser();
  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
