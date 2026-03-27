import { Route } from "@angular/router";
import { Order } from "./order";
import { authGuard } from "../../core/guards/auth-guard";
import { OrderDetailed } from "./order-detailed/order-detailed";

export const orderRoutes: Route[] = [
    {path: '', component: Order, canActivate: [authGuard]},
    {path: ':id', component: OrderDetailed, canActivate: [authGuard]},
    
]