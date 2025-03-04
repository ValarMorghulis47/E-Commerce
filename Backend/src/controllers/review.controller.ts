import { TryCatch } from "../middlewares/error.middleware.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";


const newReview = TryCatch(async (req, res, next) => {
    const { userid } = req.query;
    const user = await User.findById(userid);
    if (!user) {
        return next(new ErrorHandler("User not logged in", 404));
    }

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const { rating, comment } = req.body;
    if (!rating || !comment) {
        return next(new ErrorHandler("Please enter Rating and Comment", 400));
    }
    if (comment.length > 200) {
        return next(new ErrorHandler("Comment cannot exceed 200 characters", 400));
    }

    const alreadyReviewed = await Review.findOne({ user: userid, product: id });
    if (alreadyReviewed) {
        alreadyReviewed.rating = rating;
        alreadyReviewed.comment = comment;
        await alreadyReviewed.save();
    } else {
        const review = await Review.create({
            rating,
            comment,
            user: userid,
            product: id,
        });
        if (!review) {
            return next(new ErrorHandler("Review not created", 500));
        }
    }

    let totalRating = 0;
    const reviews = await Review.find({ product: id });
    reviews.forEach(review => {
        totalRating += review.rating;
    });
    product.numReviews = reviews.length;    // or we can just increment by 1
    product.ratings = Math.ceil(totalRating / reviews.length) || 0;
    await product.save();

    return res.status(alreadyReviewed? 200: 201).json({
        success: true,
        message: `Review ${alreadyReviewed? "updated": "created"} Successfully`,
    });
});

const getAllReviews = TryCatch(async (req, res, next) => {
    const reviews = await Review.find({product: req.params.id}).populate("user", "name photo").sort({createdAt: -1});
    if (!reviews) {
        return next(new ErrorHandler("No reviews found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "All Reviews fetched Successfully",
        reviews
    });
});

const deleteReview = TryCatch(async (req, res, next) => {
    const { userid } = req.query;
    const user = await User.findById(userid);
    if (!user) {
        return next(new ErrorHandler("User not logged in", 404));
    }

    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
        return next(new ErrorHandler("Review not found", 404));
    }
    const isOwnerReview = review.user.toString() === user._id.toString();
    if (!isOwnerReview) {
        return next(new ErrorHandler("You are not the owner of this review", 401));
    }
    await review.deleteOne();

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let totalRating = 0;
    const reviews = await Review.find({ product: id });
    reviews.forEach(review => {
        totalRating += review.rating;
    });
    product.numReviews = reviews.length;    // or we can just decrement by 1
    product.ratings = Math.ceil(totalRating / reviews.length) || 0;
    await product.save();

    return res.status(200).json({
        success: true,
        message: "Review Deleted Successfully",
    });
});


export {
    newReview, deleteReview, getAllReviews,
};

