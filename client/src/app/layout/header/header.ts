import { Component, inject } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatBadgeModule} from '@angular/material/badge';
import { MatProgressBar} from '@angular/material/progress-bar';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Busy } from '../../core/services/busy';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterLink,
    RouterLinkActive,
    MatProgressBar
],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  busyServices = inject(Busy);
  cartService = inject(CartService);
}
