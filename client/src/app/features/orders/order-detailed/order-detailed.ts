import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { single } from 'rxjs';
import { OrderM } from '../../../shared/Models/order';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentPipe } from '../../../shared/pipes/payment-pipe';
import { Account } from '../../../core/services/account';
import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentPipe,
    MatAnchor,
],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss',
})
export class OrderDetailed implements OnInit{
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(Account);
  private adminservice = inject(AdminService);
  private router = inject(Router);
  order = signal<OrderM | null>(null);
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders'

  ngOnInit(): void {
    this.loadOrder();
  }

  OnReturnClick() {
    this.accountService.isAdmin()
      ? this.router.navigateByUrl('/admin')
      : this.router.navigateByUrl('/orders')
  }

  loadOrder(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;

    const loadOrderData = this.accountService.isAdmin()
      ? this.adminservice.getOrder(+id)
      : this.orderService.getOrderDetailed(+id);

    loadOrderData.subscribe({
      next: order => this.order!.set(order),
      error: err => console.error('Error:', err)
    })
  }


}
