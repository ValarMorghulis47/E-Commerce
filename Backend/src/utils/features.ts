import mongoose from "mongoose";

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
