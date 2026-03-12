import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout';
import {MatRadioModule} from '@angular/material/radio'
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart';
import { DeliveryMethod } from '../../../shared/Models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.html',
  styleUrl: './checkout-delivery.scss',
})
export class CheckoutDelivery implements OnInit{
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        if(this.cartService.cart()?.deliveryMethodId){
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
          if(method){
            this.cartService.selectDelivery.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      }
    });
  }
  updateDeliveryMethod(method: DeliveryMethod){
    this.cartService.selectDelivery.set(method);
    const cart  = this.cartService.cart();
    if(cart){
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
      this.deliveryComplete.emit(true);
    }
  }

}
