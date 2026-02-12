import { Component, inject } from '@angular/core';
import { MatAnchor } from "@angular/material/button";
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../core/services/cart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [
    MatAnchor, 
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    CurrencyPipe
  ],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  cartService = inject(CartService);

}
