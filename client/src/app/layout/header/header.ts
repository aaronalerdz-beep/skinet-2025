import { Component, inject } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatBadgeModule} from '@angular/material/badge';
import { MatProgressBar} from '@angular/material/progress-bar';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Busy } from '../../core/services/busy';
import { CartService } from '../../core/services/cart';
import { Account } from '../../core/services/account';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem
],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  busyServices = inject(Busy);
  cartService = inject(CartService);
  accountService = inject(Account);
  private router = inject(Router);

  logout(){
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/')
      }
    })
  }
}
