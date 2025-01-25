import { barChartsStats, DashboardStats, lineChartStats, Order, pieChartStats, Product, User } from "./types";

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

export interface OrderResponse {
    success: boolean;
    message: string;
    order: Order;
};

export interface AllOrderResponse {
    success: boolean;
    message: string;
    orders: Order[];
};

export interface AllUserResponse {
    success: boolean;
    message: string;
    users: User[];
};

export interface DashboarResponse {
    success: boolean;
    message: string;
    stats: DashboardStats;
};

export interface BarChartResponse {
    success: boolean;
    message: string;
    barCharts: barChartsStats;
};

export interface PieChartResponse {
    success: boolean;
    message: string;
    pieCharts: pieChartStats;
};

export interface LineChartResponse {
    success: boolean;
    message: string;
    lineCharts: lineChartStats;
};