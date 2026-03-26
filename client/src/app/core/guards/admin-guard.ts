import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../services/account';
import { Snackbar } from '../services/snackbar';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(Account);
  const router = inject(Router);
  const snack = inject(Snackbar);


  if(accountService.isAdmin()){
    return true;
  } else{
    snack.error("No");
    router.navigateByUrl("/shop");
    return false;
  }
};
