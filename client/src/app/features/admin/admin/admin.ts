import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { OrderM } from '../../../shared/Models/order';
import { OrderParams } from '../../../shared/Models/orderParams';
import { AdminService } from '../../../core/services/admin';
import {  MatButtonModule } from '@angular/material/button';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {  MatTooltipModule } from '@angular/material/tooltip';
import {  MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from "@angular/router";
import { Dialog } from '../../../core/services/dialog';

@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    MatTabsModule,
    RouterLink
],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements  OnInit {
  private adminService = inject(AdminService)
  private dialogService = inject(Dialog)
  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  dataSource = new MatTableDataSource<OrderM>([]);
  orderPrams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All','PaymentReceived','PaymentMismatch','Refunded','Pending',]

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(){
    this.adminService.getOrders(this.orderPrams).subscribe({
      next: response => {
        if(response.data){
          this.dataSource.data = response.data;
          this.totalItems = response.count;
        }
      }
    });
  }
  onPageChange(event: PageEvent){
    this.orderPrams.pageNumber = event.pageIndex + 1;
    this.orderPrams.pageSize = event.pageSize;
  console.log(this.orderPrams);
    this.loadOrders();
  }
  onFilterSelect(event: MatSelectChange){
    this.orderPrams.filter = event.value;
    this.orderPrams.pageNumber = 1;
    this.loadOrders();
  }

  async openConfirmDialog(id: number){
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? this cannot be undone'
    )

    if(confirmed) this.refundOrder(id);
  }

  refundOrder(id: number){
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.dataSource.data = this.dataSource.data.map(o => o.id === id ? order : o)
      }
    })
  }
}
