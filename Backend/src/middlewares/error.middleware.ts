import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import { controllerType } from "../types/types.js";


export const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const message = err.message || "Something went wrong";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message: message,
    });
};

export const TryCatch = (func: controllerType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await func(req, res, next);
    } catch (error) {
        next(error);
    }
}