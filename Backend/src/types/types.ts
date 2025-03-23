import { NextFunction, Request, Response } from "express";

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface newUserRequest {
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: Date;
};

export interface newProductRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
};

export interface newOrderRequest {
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    discount: number;
    shippingCharges: number;
    total: number;
    user: string;
    status: string;
};

export interface newCouponRequest {
    code: string;
    amount: number;
};

export type SearchProduct = {
    search?: string;
    category?: string;
    price?: number;
    sort?: string;
    page?: number;
};

export type BaseQuerySearch = {
    name?: {
        $regex: string;
        $options: string;
    },
    category?: string;
    price?: {
        $lte: number;
    }
};

export type ShippingInfo = {
    address: string;
    city: string;
    pinCode: number;
    country: string;
    state: string;
};

export type OrderItem = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
};

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    review?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
};