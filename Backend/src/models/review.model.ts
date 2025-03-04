import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, "Please enter Rating"],
        min: 0,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, "Please enter Comment"],
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
}, {
    timestamps: true,
});

export const Review = mongoose.model("Review", reviewSchema);