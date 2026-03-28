import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { OrderM } from '../../../shared/Models/order';
import { OrderParams } from '../../../shared/Models/orderParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Dialog } from '../../../core/services/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomTable } from '../../../shared/components/custom-table/custom-table';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    MatPaginatorModule,
    CommonModule,
    CustomTable
],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.scss']
})
export class AdminOrders implements OnInit {
  orders = signal<OrderM[]>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(Dialog);
  private router = inject(Router);
  orderParams = new OrderParams();
  totalItems = 0;

  columns = [
    { field: 'id', header: 'No.' },
    { field: 'buyerEmail', header: 'Buyer Email' },
    { field: 'orderDate', header: 'Order Date', pipe: 'date', pipeArgs: { year: 'numeric', month: 'short', day: 'numeric' } },
    { field: 'total', header: 'Total', pipe: 'currency', pipeArgs: 'USD' },
    { field: 'status', header: 'Status' }
  ];

  actions = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View Order',
      action: (row: any) => {
        this.router.navigateByUrl(`/orders/${row.id}`)
      }
    },
    {
      label: 'Refund',
      icon: 'undo',
      tooltip: 'Refund Order',
      disabled: (row: any) => row.status === 'Refunded',
      action: (row: any) => {
        this.openConfirmDialog(row.id);
      }
    }
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.orders.set(response.data);
          this.totalItems = response.count;
        }
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onAction(action: (row: any) => void, row: any) {
    action(row);
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? This cannot be undone'
    );
    if (confirmed) this.refundOrder(id);
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => { 
        this.orders.update(currentOrders => 
          currentOrders.map(o => o.id === id ? order : o)
        );
        this.loadOrders(); // Update displayed data after refund
      }
    });
  }
}