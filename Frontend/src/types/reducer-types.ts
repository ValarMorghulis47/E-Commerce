import { CartItemType, ShippingInfo, User } from "./types"

export type UserReducerInitialState = {
    user: User | null;
    loading: boolean;
}

export type CartReducerInitialState = {
    loading: boolean;
    cartItems: CartItemType[];
    subtotal: number;
    shippingCharges: number;
    tax: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
    coupon: string | undefined;
};