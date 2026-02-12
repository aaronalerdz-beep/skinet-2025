import { Component, inject, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartItemM } from "../../../shared/Models/cart";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart';
@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink, 
    MatButtonModule, 
    MatIcon, 
    CurrencyPipe
  ],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
})

export class CartItem {
  item = input.required<CartItemM>();
  cartService = inject(CartService);

  incrementQuantity(){
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity(){
    this.cartService.removeItemFromCart(this.item().productId);
  }

  removeItemFromCart(){
    this.cartService.removeItemFromCart(this.item().productId, this.item().quantity);
  }
}
