import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartItemM, CartM } from '../../shared/Models/cart';
import { Product } from '../../shared/Models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<CartM| null>(null); 
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  });
  total = computed(() =>{
    const cart = this.cart();
    if (!cart) return null
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const discount = 0;
    return{
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  })

  getCart(id: string){
    return this.http.get<CartM>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }
  setCart(cart: CartM){
    return this.http.post<CartM>(this.baseUrl + 'cart', cart).subscribe({
      next:cart => this.cart.set(cart)
    })
  }

  addItemToCart(item: CartItemM | Product, quantity = 1){
    const cart = this.cart() ?? this.createCart();
    
    if (this.isProduct(item)){
      item = this.mapProductToCartItem(item);
      
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity = 1){
    const cart = this.cart();
    if(!cart) return;
    const index = cart.items.findIndex(x => x.productId === productId);
    if(index !== -1){
      if(cart.items[index].quantity >1){
        cart.items[index].quantity -= quantity;
      } else{
        cart.items.splice(index, 1);
      }
    }
    if(cart.items.length === 0){
      this.deleteCart();
    }else{
      this.setCart(cart);
    }


  }
  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null)
      }
    })
  }
  
  private addOrUpdateItem(items: CartItemM[], item: CartItemM, quantity: number): CartItemM[] {
    const index = items.findIndex(x => x.productId === item.productId);
    if(index === -1){
      item.quantity = quantity;
      items.push(item);
    } else{
      items[index].quantity += quantity
    }
    return items;
  }
  mapProductToCartItem(item: Product): CartItemM  {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct (item: CartItemM | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): CartM{
    const cart = new CartM();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}


