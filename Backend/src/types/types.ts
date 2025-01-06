import { NextFunction, Request, Response } from "express";

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
    price: number;
    category: string;
    stock: number;
};

export type SearchProduct = {
    search?: string;
    category?: string;
    price?: number;
    sort?: string;
    page?: number;
}

export type BaseQuerySearch = {
    name?: {
        $regex: string;
        $options: string;
    },
    category?: string;
    price?: {
        $lte: number;
    }
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;