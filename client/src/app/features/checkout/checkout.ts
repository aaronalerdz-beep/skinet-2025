import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Router, RouterLink } from "@angular/router";
import { MatAnchor } from "@angular/material/button";
import { StripeService } from '../../core/services/stripe';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { Snackbar } from '../../core/services/snackbar';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/Models/user';
import { Account } from '../../core/services/account';
import { firstValueFrom } from 'rxjs';
import { CheckoutDelivery } from "./checkout-delivery/checkout-delivery";
import { CheckoutReview } from "./checkout-review/checkout-review";
import { CartService } from '../../core/services/cart';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummary,
    MatStepperModule,
    RouterLink,
    MatAnchor,
    MatCheckboxModule,
    CheckoutDelivery,
    CheckoutReview,
    CurrencyPipe,
    MatProgressSpinnerModule
],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements AfterViewInit, OnDestroy {
  private snackbar = inject(Snackbar);
  private router = inject(Router);
  private stripeService = inject(StripeService);
  private accountService = inject(Account)
  cartService = inject(CartService)
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completioionStatus = signal<{address: boolean, card:boolean, delivery: boolean}>(
    {address: false, card:false, delivery: false}
  );
  confirmationToken?: ConfirmationToken;
  loading = false;

  constructor(){
    this.handleAddressChange = this.handleAddressChange.bind(this);
    
  }

  async ngAfterViewInit(){
    try{
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch(error: any){
      this.snackbar.error(error.message);
    }
  }
  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completioionStatus.update(state => ({
      ...state,
      address: event.complete
    }));
  }
  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completioionStatus.update(state => ({
      ...state,
      card: event.complete
    }));
  }
  handleDeliveryChange = (event: boolean) => {
   this.completioionStatus.update(state =>{
    state.delivery = event;
    return state;
   }) 
  }
  async getConfirmationToken(){
    try{
      if(Object.values(this.completioionStatus()).every(status => status === true)){
        const result = await this.stripeService.createConfirmationToken();
        if(result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken)
      }
    }catch(error: any){
      this.snackbar.error(error.message);
    }
  }

  async onStepChange(event: StepperSelectionEvent) {
    if(event.selectedIndex === 1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if(event.selectedIndex === 2){
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if(event.selectedIndex === 3){
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper){
    this.loading = true;
    try{
      if(this.confirmationToken){
        const result = await this.stripeService.confirmPayment(this.confirmationToken);
        if(result.error){
          throw new Error(result.error.message);
        }else{
          this.cartService.deleteCart();
          this.cartService.selectDelivery.set(null);
          this.router.navigateByUrl('/checkout/success');
        }
      }
    }catch(error: any){
      this.snackbar.error(error.message || 'Something went wrong');
      stepper.previous();
    } finally{
      this.loading = false;
    }
  }
  private async getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address){
      return{
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          country: address.country,
          state: address.state,
          postalCode: address.postal_code
      }
    }else{
      return null;
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange){
    this.saveAddress = event.checked;
  }
  ngOnDestroy() {
    this.stripeService.disposeElements();
  }
}
