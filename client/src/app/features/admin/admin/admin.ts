import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { AdminOrders } from '../admin-orders/admin-orders';
import { AdminCatalogComponent } from "../admin-catalog/admin-catalog";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTabsModule,
    AdminOrders,
    AdminCatalogComponent
],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {

}

