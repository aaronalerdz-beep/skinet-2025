import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order';
import { OrderM } from '../../shared/Models/order';
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order implements OnInit{
  private orderService = inject(OrderService);
  orders = signal<OrderM[]>([]);
  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => this.orders.set(orders)
    })
  }


}
