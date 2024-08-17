import { NextFunction, Request, Response } from "express";


export interface newUserRequest {
    name: string;
    email: string;
};

export type controllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<Response<any, Record<string, any>>>