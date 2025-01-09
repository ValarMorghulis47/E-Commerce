import mongoose, { Document } from "mongoose";
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
};

const getBase64 = (file: Express.Multer.File) => {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

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

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};

export const getInventoryData = async (productCategories: string[], productsCount: number) => {
    const individualProductCountPromise = productCategories.map((category) => {
        return Product.countDocuments({ category });
    });

    const individualProductCount = await Promise.all(individualProductCountPromise);

    const inventoryData = productCategories.map((category, index) => ({
        [category]: Math.round((individualProductCount[index] / productsCount) * 100),
    }));
    return inventoryData;
    // OR If the above is too complex, you can use the below code
    // const inventoryData: Record<string, number>[] = [];

    // productCategories.forEach((category, i) => {
    //     inventoryData.push({
    //         [category]: Math.round((individualProductCount[i] / productsCount) * 100),
    //     });
    // });

    // return inventoryData;
};

export const getCharData = ({length, docArray, today, property}: FuncProps) => {
    const data: number[] = new Array(length).fill(0);

    docArray.forEach(singleDoc => {
        const creationDate = singleDoc.createdAt;
        const differenceFromCurrentMonth = (today.getMonth() - creationDate.getMonth() + 12) % 12; // this will give me the difference between the current month and the month of the order creation. +12 is to avoid negative values and %12 is to get the remainder(Just to nullify the effect of +12)
        if (differenceFromCurrentMonth < length) { 
            if (property) {
                data[length - differenceFromCurrentMonth] += singleDoc[property]!;
            } else {
                data[length - differenceFromCurrentMonth] += 1;
            }
        };
    });

    return data;
};

interface DocArray extends Document {
    createdAt: Date;
    total?: number;
    discount?: number;
};

type FuncProps = {
    length: number;
    docArray: DocArray[];
    today: Date;
    property?: "total" | "discount";
};