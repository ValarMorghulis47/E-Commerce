import { NextFunction, Request, Response } from "express";
import { TryCatch } from "./error.middleware.js";
import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";


export const adminOnly = TryCatch(async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    if (!id) {
        return next(new ErrorHandler("Please provide an id", 400));
    }

    const user = await User.findById({id});
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (user.role !== "admin") {
        return next(new ErrorHandler("You are not authorized to perform this action", 401));
    }

    next();
});