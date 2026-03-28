import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrderParams } from '../../shared/Models/orderParams';
import { HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/Models/pagination';
import { OrderM } from '../../shared/Models/order';
import { Product } from '../../shared/Models/product';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getOrders(orderParams: OrderParams){
    let params = new HttpParams();
    if(orderParams.filter && orderParams.filter !== 'All'){
      params = params.append('status', orderParams.filter);
    }
    params = params.append('pageIndex', orderParams.pageNumber);
    params = params.append('pageSize', orderParams.pageSize);

    return this.http.get<Pagination<OrderM>>(this.baseUrl + 'admin/orders/', {params})
  }

  getOrder(id: number){
    return this.http.get<OrderM>(this.baseUrl + 'admin/orders/' + id);

  }

  refundOrder(id : number){
    return this.http.post<OrderM>(this.baseUrl + 'admin/orders/refund/' + id, {});
  }
  
   createProduct(product: Product) {
    return this.http.post<Product>(this.baseUrl + 'products', product);
  }

  updateProduct(product: Product) {
    return this.http.put(this.baseUrl + 'products/' + product.id, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }

  updateStock(id: number, newQuantity: number) {
    return this.http.put(this.baseUrl + 'products/update-stock/' + id, newQuantity);
  }
}
