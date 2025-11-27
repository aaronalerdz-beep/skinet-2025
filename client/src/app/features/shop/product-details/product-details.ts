import { Component, inject, signal  } from '@angular/core';
import { ShopService } from '../../../core/services/shop';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/Models/product';
import { MatIcon } from "@angular/material/icon";
import { CurrencyPipe } from '@angular/common';
import { MatAnchor } from "@angular/material/button";
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatAnchor,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider
],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  private shopService = inject(ShopService);
  private activateRuote = inject(ActivatedRoute);
  product = signal<Product | null>(null);

  ngOnInit(): void{
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activateRuote.snapshot.paramMap.get('id');
    if(!id) return;

    this.shopService.getProduct(+id).subscribe({
      next: product => this.product.set(product),
      error: error => console.log(error)
    })
  }
}
