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
import { CartService } from '../../../core/services/cart';
import { FormsModule } from '@angular/forms';

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
    MatDivider,
    FormsModule
],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  private shopService = inject(ShopService);
  private activateRuote = inject(ActivatedRoute);
  private cartService = inject(CartService)
  product = signal<Product | null>(null);
  
  quantityInCart = 0;
  quantity = 1;

  ngOnInit(): void{
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activateRuote.snapshot.paramMap.get('id');
    if(!id) return;

    this.shopService.getProduct(+id).subscribe({
      next: product => {
        this.product.set(product);
        this.updateQuantityInCart();
      },
      error: error => console.log(error)
    })
  }
  updateCart(){
   const currentProduct = this.product();
    if(currentProduct) {
      if(this.quantity > this.quantityInCart){
        const itemsToAdd = this.quantity - this.quantityInCart;

        this.quantityInCart += itemsToAdd;
        this.cartService.addItemToCart(currentProduct, itemsToAdd);
      }else{
        const itemToRemove = this.quantityInCart - this.quantity;
        this.quantityInCart -= itemToRemove;
        this.cartService.removeItemFromCart(currentProduct.id, itemToRemove);
      }
    }
  }

  updateQuantityInCart(){
    this.quantityInCart = this.cartService.cart()?.items
      .find(x => x.productId === this.product()?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText(){
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart'
  }
}
