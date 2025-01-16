import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import { ControllerType } from "../types/types.js";


export const errorMiddleware = (
    err: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    if (err.name === "CastError") err.message = "Invalid ID";

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export const TryCatch = (func: ControllerType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await func(req, res, next);
    } catch (error) {
        next(error);
    }
}