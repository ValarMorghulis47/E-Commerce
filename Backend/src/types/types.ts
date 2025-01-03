import { NextFunction, Request, Response } from "express";


export interface newUserRequest {
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: string;
};

export type controllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<Response<any, Record<string, any>>>