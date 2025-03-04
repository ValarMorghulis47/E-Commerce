import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Name"],
    },
    description: {
        type: String,
        required: [true, "Please enter Description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter Price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter Stock"],
    },
    photos: [
        {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter Category"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export const Product = mongoose.model("Product", productSchema);