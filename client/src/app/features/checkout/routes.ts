import { Route } from "@angular/router";
import { Checkout } from "./checkout";
import { authGuard } from "../../core/guards/auth-guard";
import { emptyCartGuard } from "../../core/guards/empty-cart-guard";
import { CheckoutSuccess } from "./checkout-success/checkout-success";
import { orderCompleteGuard } from "../../core/guards/order-complete-guard";

export const checkoutRoutes: Route[] = [
    {path: '', component: Checkout, canActivate: [authGuard, emptyCartGuard]},
    {path: 'success', component: CheckoutSuccess, 
        canActivate: [authGuard, orderCompleteGuard]},
    
]