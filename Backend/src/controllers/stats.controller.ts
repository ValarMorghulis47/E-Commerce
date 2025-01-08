import { TryCatch } from "../middlewares/error.middleware.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { calculatePercentage, getInventoryData } from "../utils/features.js";


const getDashboardStats = TryCatch(async (_, res, __) => {

    let stats = {};

    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const currentMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today
    }

    const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
    }

    const currentMonthProductPromise = Product.find({
        createdAt: {
            $gte: currentMonth.start,
            $lte: currentMonth.end
        }
    });

    const lastMonthProductPromise = Product.find({
        createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end
        }
    });

    const currentMonthUserPromise = User.find({
        createdAt: {
            $gte: currentMonth.start,
            $lte: currentMonth.end
        }
    });

    const lastMonthUserPromise = User.find({
        createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end
        }
    });

    const currentMonthOrdersPromise = Order.find({
        createdAt: {
            $gte: currentMonth.start,
            $lte: currentMonth.end
        }
    });

    const lastMonthOrdersPromise = Order.find({
        createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end
        }
    });

    const lastSixMonthsOrdersPromise = Order.find({
        createdAt: {
            $gte: sixMonthsAgo,
            $lte: today
        }
    });

    const last4OrdersPromise = Order.find({}).select("discount total status orderItems").limit(4).sort({ createdAt: -1 });

    const [currentMonthProducts, lastMonthProducts, currentMonthUsers, lastMonthUsers, currentMonthOrders, lastMonthOrders, allOrdersWithTotal, allUsersCount, allProductsCount, lastSixMonthsOrders, productCategories, userMaleCount, last4Orders] = await Promise.all([
        currentMonthProductPromise,
        lastMonthProductPromise,
        currentMonthUserPromise,
        lastMonthUserPromise,
        currentMonthOrdersPromise,
        lastMonthOrdersPromise,
        Order.find({}).select("total"),
        User.countDocuments(),
        Product.countDocuments(),
        lastSixMonthsOrdersPromise,
        Product.distinct("category"),
        User.countDocuments({ gender: "male" }),
        last4OrdersPromise
    ]);

    const currentMonthRevenue = currentMonthOrders.reduce((total, singleOrder) => total + (singleOrder.total || 0), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((total, singleOrder) => total + (singleOrder.total || 0), 0);

    const changePercent = {
        revenue: calculatePercentage(currentMonthRevenue, lastMonthRevenue),
        users: calculatePercentage(currentMonthUsers.length, lastMonthUsers.length),
        transactions: calculatePercentage(currentMonthOrders.length, lastMonthOrders.length),
        products: calculatePercentage(currentMonthProducts.length, lastMonthProducts.length),
    };

    const totalRevenue = allOrdersWithTotal.reduce((total, singleOrder) => total + (singleOrder.total || 0), 0)

    const totalCount = {
        totalRevenue,
        totalUsers: allUsersCount,
        totalOrders: allOrdersWithTotal.length,
        totalProducts: allProductsCount
    };

    const thatMonthNumberOfOrders = new Array(6).fill(0);
    const thatMonthRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach(order => {
        const orderCreationDate = order.createdAt;
        const differenceFromCurrentMonth = (today.getMonth() - orderCreationDate.getMonth() + 12) % 12; // this will give me the difference between the current month and the month of the order creation
        if (differenceFromCurrentMonth < 6) { // if the order is within the last 6 months
            // using 5 here because the array index starts from 0
            thatMonthNumberOfOrders[5 - differenceFromCurrentMonth] += 1; 
            thatMonthRevenue[5 - differenceFromCurrentMonth] += order.total;
        }
    });

    let chartData = {
        order: thatMonthNumberOfOrders,
        revenue: thatMonthRevenue
    }

    const inventoryData = await getInventoryData(productCategories, allProductsCount);

    let userRatio = {
        male: userMaleCount,
        female: allUsersCount - userMaleCount 
    }

    const recentOrders = last4Orders.map(order => {
        return {
            _id: order._id,
            discount: order.discount,
            total: order.total,
            status: order.status,
            quantity: order.orderItems.length
        }
    });

    stats = {
        changePercent,
        totalCount,
        chartData,
        inventoryData,
        userRatio,
        recentOrders
    };

    return res.status(200).json({
        success: true,
        message: "Stats fetched successfully",
        stats
    });
});


export {
    getDashboardStats
}