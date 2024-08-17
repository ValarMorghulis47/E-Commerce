import { NextFunction, Request, Response } from "express";
import { newUserRequest } from "../types/types.js";
import { TryCatch } from "../middlewares/error.middleware.js";


const newUser = TryCatch(async(req: Request<{}, {}, newUserRequest>, res: Response, next: NextFunction) => {
    const { name, email } = req.body;

    return res.status(200).json({
        status: "success",
        data: {
            name,
            email,
        },
    });
});


export {
    newUser
}