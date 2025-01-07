import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please enter Coupon Code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Please enter Amount"],
    },
}, {
    timestamps: true,
});

export const Coupon = mongoose.model("Coupon", couponSchema);