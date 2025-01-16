import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.middleware.js";
import { BaseQuerySearch, newProductRequest, SearchProduct } from "../types/types.js";
import ErrorHandler from "../utils/errorHandler.js";
import { DeleteFilesCloudinary, UploadFilesCloudinary } from "../utils/features.js";
import { Product } from "../models/product.model.js";



const newProduct = TryCatch(async (req: Request<{}, {}, newProductRequest>, res, next) => {

    const { name, price, category, stock } = req.body;
    if (!name || !price || !category || !stock) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const photos = req.files as Express.Multer.File[];
    if (!photos) {
        return next(new ErrorHandler("Please upload photos", 400));
    }
    if (photos.length < 1) {
        return next(new ErrorHandler("Please upload at least one photo", 400));
    }
    if (photos.length > 5) {
        return next(new ErrorHandler("Please upload maximum 5 photos", 400));
    }
    const photoUrls = await UploadFilesCloudinary(photos, "products");

    const product = await Product.create({
        name,
        price,
        category: category.toLowerCase(),
        stock,
        photos: photoUrls,
    })
    if (!product) {
        const public_ids = photoUrls.map((photo) => photo.public_id);
        await DeleteFilesCloudinary(public_ids);
        return next(new ErrorHandler("Failed to create product", 500));
    }

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });

});

const getAllProductsAdmin = TryCatch(async (req, res, next) => {

    const products = await Product.find();

    return res.status(200).json({
        success: true,
        message: "Products fetched Successfully",
        products
    });
});

const getSingleProduct = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Product fetched Successfully",
        product
    });
})

const updateProduct = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    // TODO: Only Update The Specific Photos
    const photos = req.files as Express.Multer.File[] | undefined;
    if (photos && photos.length > 0) {
        const photoUrls = await UploadFilesCloudinary(photos, "products");
        const oldPublicIds = product.photos.map((photo) => photo.public_id);
        await DeleteFilesCloudinary(oldPublicIds);
        product.photos = photoUrls.map(photo => ({ url: photo.url, public_id: photo.public_id })) as any;
    };

    const updateData = req.body;
    Object.assign(product, updateData);
    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product updated Successfully",
        product
    });
});

const deleteProduct = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }

    const public_ids = product.photos.map((photo) => photo.public_id);
    await DeleteFilesCloudinary(public_ids);

    await product.deleteOne();

    return res.status(200).json({
        status: true,
        message: "Product Deleted Successfully"
    });

});

const getLatestProducts = TryCatch(async (req, res, next) => {

    const products = await Product.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
        success: true,
        message: "Latest Products fetched Successfully",
        products
    });

});

const getCategories = TryCatch(async (req, res, next) => {

    const categories = await Product.distinct("category");

    return res.status(200).json({
        success: true,
        message: "Categories fetched Successfully",
        categories
    });
});

const getSearchProducts = TryCatch(async (req: Request<{}, {}, {}, SearchProduct>, res, next) => {

    const { search, category, price, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.SEARCH_PRODUCT_LIMIT) || 10;
    const skipProducts = (page - 1) * limit;

    const searchObj: BaseQuerySearch = {};
    if (search) {
        searchObj.name = {
            $regex: search,
            $options: "i"
        }
    }
    if (category) {
        searchObj.category = category;
    }
    if (price) {
        searchObj.price = {
            $lte: Number(price)
        }
    }
    // This line of code will give me the limit of products to be fetched
    const productsPromise = Product.find(searchObj).limit(limit).skip(skipProducts).sort({ price: sort?.toString() === "asc" ? 1 : -1 });
    // This line of code will give me the total number of products that match the search criteria
    const [filteredProducts, totalPages] = await Promise.all([
        productsPromise,
        Product.countDocuments(searchObj)
    ]);

    return res.status(200).json({
        success: true,
        message: "Products fetched Successfully",
        filteredProducts,
        totalPages
    });
});


export {
    newProduct,
    getAllProductsAdmin,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getLatestProducts,
    getCategories,
    getSearchProducts
}