import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Signalr } from '../../../core/services/signalr';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentPipe } from '../../../shared/pipes/payment-pipe';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-checkout-success',
  imports: [
    MatButton,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    PaymentPipe,
    AddressPipe,
    MatProgressSpinner
],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss',
})
export class CheckoutSuccess implements OnDestroy {
  signalService = inject(Signalr);
  private orderService = inject(OrderService);
  
  ngOnDestroy(): void {
    this.orderService.orderComplete = false;
    this.signalService.orderSignal.set(null);
  }
  

}
