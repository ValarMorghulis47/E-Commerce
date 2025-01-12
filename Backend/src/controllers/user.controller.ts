import { NextFunction, Request, Response } from "express";
import { newUserRequest } from "../types/types.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";


const newUser = TryCatch(async(req: Request<{}, {}, newUserRequest>, res, next) => {
    const { name, email, photo, dob, _id, gender } = req.body;

    const user = await User.findById({ _id});
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            user
        })
    }

    if (!name || !email || !photo || !dob || !_id || !gender){
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const newUser = await User.create({
        name,
        email,
        photo,
        dob: new Date(dob),
        _id,
        gender
    });

    return res.status(200).json({
        success: true,
        message: `Welcome ${newUser.name}`,
        user
    });
});

const getAllUsers = TryCatch(async(req, res, next) => {
    const users = await User.find();
    if (!users) {
        return next(new ErrorHandler("No users found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "All users fetched Successfully",
        users
    });
});

const getSingleUser = TryCatch(async(req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "User fetched Successfully",
        user
    });
});

const deleteUser = TryCatch(async(req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne();

    return res.status(200).json({
        success: true,
        message: "User deleted Successfully",
    });
});


export {
    newUser,
    getAllUsers,
    getSingleUser,
    deleteUser
}