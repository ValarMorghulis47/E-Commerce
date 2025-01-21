import { Product, User } from "./types";

export type CustomError = {
    status: number;
    data: {
        message: string;
        success: boolean;
    };
};

export interface UserResponse {
    success: boolean;
    message: string;
    user: User;
};

export interface ProductResponse {
    success: boolean;
    message: string;
    products: Product[];
};

export interface newProductResponse {
    success: boolean;
    message: string;
    product: Product;
};

export interface DeleteResponse {
    success: boolean;
    message: string;
};

export interface cateogoriesResponse {
    success: boolean;
    message: string;
    categories: string[];
};

export interface SearchProductResponse extends ProductResponse {
    totalPages: number;
};

export interface ApplyCouponResponse {
    success: boolean;
    message: string;
    discount: number;
};