import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItemType } from "../../types/types";

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    shippingCharges: 0,
    tax: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: "",
        city: "",
        country: "",
        pinCode: "",
        state: "",
    },
    coupon: undefined,
};

const calculateShippingCharges = (subtotal: number): number => {
    return subtotal > 100 ? 10 : 0;
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItemType>) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.productId === item.productId);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.productId === existItem.productId ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            state.shippingCharges = calculateShippingCharges(state.subtotal);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter((x) => x.productId !== action.payload);
            state.shippingCharges = calculateShippingCharges(state.subtotal);
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
        },
        calculatePrice: (state) => {
            state.subtotal = state.cartItems.reduce(
                (total, item) => total + (item.price * item.quantity), 0
            );
            state.shippingCharges = calculateShippingCharges(state.subtotal);
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
        },
        applyDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
        }
        // saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
        //     state.shippingInfo = action.payload;
        // },
        // saveCoupon: (state, action: PayloadAction<string>) => {
        //     state.coupon = action.payload;
        // },
        // clearCart: (state) => {
        //     state.cartItems = [];
        //     state.subtotal = 0;
        //     state.shippingCharges = 0;
        //     state.tax = 0;
        //     state.discount = 0;
        //     state.total = 0;
        //     state.shippingInfo = {
        //         address: "",
        //         city: "",
        //         country: "",
        //         pinCode: "",
        //         state: "",
        //     };
        //     state.coupon = undefined;
        // },
    }
});

export const { addToCart, removeFromCart, calculatePrice, applyDiscount } = cartReducer.actions;