import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { OrderItem } from "../types/types.js";
import { Product } from "../models/product.model.js";

export const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URI);

        const obj = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`);
        console.log(`Database connected. DB Connection Host: ${obj.connection.host}`);
    }
    catch (error) {
        console.log(`Database Connection Error: ${(error as Error).message}`);
        process.exit(1);
    }
}

const getBase64 = (file: Express.Multer.File) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const UploadFilesCloudinary = async (files: Express.Multer.File[], folderName: string) => {
    const uploadPromises = files.map((file) => {
        return new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                    folder: folderName,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!);
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result) => ({
            url: result.secure_url,
            public_id: result.public_id,
        }));
        return formattedResults;
    } catch (err) {
        throw new Error("Error uploading files to cloudinary", err as Error);
    }
};

export const DeleteFilesCloudinary = async (public_ids: string[]) => {
    const deletePromises = public_ids.map((public_id) => {
        return new Promise<void>((resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    });

    try {
        await Promise.all(deletePromises);
    } catch (err) {
        throw new Error("Error deleting files from cloudinary", err as Error);
    }
};

export const reduceStock = async (orderItems: OrderItem[]) => {
    orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error("Product not found");
        product.stock -= item.quantity;
        await product.save();
    });
    // for (let i = 0; i < orderItems.length; i++) {
    //     const order = orderItems[i];
    //     const product = await Product.findById(order.productId);
    //     if (!product) throw new Error("Product not found");
    //     product.stock -= order.quantity;
    //     await product.save();
    // }
};
