import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { single } from 'rxjs';
import { OrderM } from '../../../shared/Models/order';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentPipe } from '../../../shared/pipes/payment-pipe';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentPipe,
    MatAnchor,
    RouterLink
],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss',
})
export class OrderDetailed implements OnInit{
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order = signal<OrderM | null>(null);

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;
    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => this.order!.set(order),
      error: err => console.error('Error:', err)
    })
  }


}
