import {nanoid} from 'nanoid';
export interface CartType {
    id: string;
    items: CartItemM[];
    deliveryMethodId?: number;
    paymentIntentId?: string;
    clientSecret?: string;
}

export interface CartItemM{
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class CartM implements CartType {
    id = nanoid();
    items: CartItemM[] = [];
    deliveryMethodId?: number;
    paymentIntentId?: string;
    clientSecret?: string;
}