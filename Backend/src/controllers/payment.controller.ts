import { Request } from "express";
import { TryCatch } from "../middlewares/error.middleware.js";
import { newCouponRequest } from "../types/types.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Coupon } from "../models/coupon.model.js";


const newCoupon = TryCatch(async (req: Request<{}, {}, newCouponRequest>, res, next) => {

    const { code, amount } = req.body;
    if (!code || !amount) {
       return next(new ErrorHandler("Please enter Coupon Code and Amount", 400));
    }

    const coupon = await Coupon.create({
        code,
        amount,
    });
    if (!coupon) {
        return next(new ErrorHandler("Coupon not created", 500));
    }

    return res.status(201).json({
        success: true,
        message: "Coupon Created Successfully",
        coupon,
    });

});

const applyCoupon = TryCatch(async (req, res, next) => {
    
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
        return next(new ErrorHandler("Invalid Coupon", 400));
    }

    return res.status(200).json({
        success: true,
        message: "Coupon Applied Successfully",
        discount: coupon.amount,
    });
});

const updateCoupon = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const updateData = req.body;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }

    Object.assign(coupon, updateData);
    await coupon.save();

    return res.status(200).json({
        success: true,
        message: "Coupon Updated Successfully",
        coupon,
    });
});

const deleteCoupon = TryCatch(async (req, res, next) => {

    const { id } = req.params;  
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Coupon Deleted Successfully",
    });
});

const getSingleCoupon = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Coupon fetched Successfully",
        coupon,
    });
});

const getAllCoupons = TryCatch(async (req, res, next) => {

    const coupons = await Coupon.find();
    if (!coupons) {
        return next(new ErrorHandler("No Coupons found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Coupons fetched Successfully",
        coupons,
    });
});

export {
    newCoupon,
    applyCoupon,
    updateCoupon,
    deleteCoupon,
    getSingleCoupon,
    getAllCoupons,
}