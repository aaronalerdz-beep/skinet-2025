import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ShopService } from '../../../core/services/shop';
import { Product } from '../../../shared/Models/product';
import { ShopParams } from '../../../shared/Models/shopParams';
import { CustomTable } from '../../../shared/components/custom-table/custom-table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProductForm } from '../product-form/product-form';
import { AdminService } from '../../../core/services/admin';
import { firstValueFrom } from 'rxjs';
import { Dialog } from '../../../core/services/dialog';
import { Router } from '@angular/router';
import { UpdateQuantity } from '../update-quantity/update-quantity';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [
    CustomTable,
    MatButtonModule
  ],
  templateUrl: './admin-catalog.html',
  styleUrl: './admin-catalog.scss'
})
export class AdminCatalogComponent {
  products = signal<Product[]>([]);
  private dialog = inject(MatDialog);
  private dialogService = inject(Dialog);
  private shopService = inject(ShopService);
  private adminService = inject(AdminService);
  private router = inject(Router);
  productParams = new ShopParams();
  totalItems = 0;

  columns = [
    { field: 'id', header: 'No.' },
    { field: 'name', header: 'Product name' },
    { field: 'type', header: 'Type' },
    { field: 'brand', header: 'Brand' },
    { field: 'quantityInStock', header: 'Quantity' },
    { field: 'price', header: 'Price', pipe: 'currency', pipeArgs: 'USD' }
  ];

  actions = [
    {
      label: 'Edit',
      icon: 'edit',
      tooltip: 'Edit product',
      action: (row: any) => {
        this.openEditDialog(row)
      }
    },
    {
      label: 'Delete',
      icon: 'delete',
      tooltip: 'Delete product',
      action: (row: any) => {
        this.openConfirmDialog(row.id)
      }
    },
     {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View product',
      action: (row: any) => {
        this.router.navigateByUrl(`/shop/${row.id}`)
      }
    },
    {
      label: 'Update quantity',
      icon: 'add_circle',
      tooltip: 'Update quantity in stock',
      action: (row: any) => {
        this.openQuantityDialog(row);
      }
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.shopService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.products.set(response.data);
          this.totalItems = response.count;
        }
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }
  openCreateDialog() {
    const dialog = this.dialog.open(ProductForm, {
      minWidth: '500px',
      data: {
        title: 'Create product'
      }
    });
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          const product = await firstValueFrom(this.adminService.createProduct(result.product));
          if (product) {
            this.products().push(product);
          }
        }
      }
    })
  }
  openEditDialog(product: Product) {
    const dialog = this.dialog.open(ProductForm, {
      minWidth: '500px',
      data: {
        title: 'Edit product',
        product
      }
    })
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          await firstValueFrom(this.adminService.updateProduct(result.product));
          const index = this.products().findIndex(p => p.id === result.product.id);
          if (index !== -1) {
            this.products()[index] = result.product;
          }
        }
      }
    })
  }
  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete product',
      'Are you sure you want to delete this product? This cannot be undone'
    );
    if (confirmed) this.onDelete(id);
  }
    openQuantityDialog(product: Product) {
    const dialog = this.dialog.open(UpdateQuantity, {
      minWidth: '500px',
      data: {
        quantity: product.quantityInStock,
        name: product.name
      }
    })
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          console.log(result);
          await firstValueFrom(this.adminService.updateStock(product.id, result.updatedQuantity));
          const index = this.products().findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products()[index].quantityInStock = result.updatedQuantity;
          }
        }
      }
    })
  }

  onDelete(id: number) {
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(prods => prods.filter(x => x.id !== id));
      }
    })
  }

}
