import { TryCatch } from "../middlewares/error.middleware.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { calculatePercentage, getCharData, getInventoryData } from "../utils/features.js";


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

const getBarChartsData = TryCatch(async (_, res, __) => {

    let barCharts = {};

    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tweleveMonthsAgo = new Date();
    tweleveMonthsAgo.setMonth(tweleveMonthsAgo.getMonth() - 12);

    const sixMonthsAgoUserPromise = User.find({
        createdAt: {
            $gte: sixMonthsAgo,
            $lte: today
        }
    }).select('createdAt');

    const sixMonthsAgoProductPromise = Product.find({
        createdAt: {
            $gte: sixMonthsAgo,
            $lte: today
        }
    }).select('createdAt');

    const tweleveMonthsAgoOrdersPromise = Order.find({
        createdAt: {
            $gte: tweleveMonthsAgo,
            $lte: today
        }
    }).select('createdAt');

    const [sixMonthsAgoUsers, sixMonthsAgoProducts, tweleveMonthsAgoOrders] = await Promise.all([
        sixMonthsAgoUserPromise,
        sixMonthsAgoProductPromise,
        tweleveMonthsAgoOrdersPromise
    ]);

    const userChartData = getCharData({ length: 6, docArray: sixMonthsAgoUsers, today });
    const productChartData = getCharData({ length: 6, docArray: sixMonthsAgoProducts, today });
    const ordersChartData = getCharData({ length: 12, docArray: tweleveMonthsAgoOrders, today });

    barCharts = {
        userChartData,
        productChartData,
        ordersChartData
    };

    return res.status(200).json({
        success: true,
        message: "Bar charts data fetched successfully",
        barCharts
    });
});

const getPieChartsData = TryCatch(async (_, res, __) => {

    let pieCharts = {};

    const processingOrdersPromise = Order.countDocuments({ status: "processing" });
    const shippedOrdersPromise = Order.countDocuments({ status: "shipped" });
    const deliveredOrdersPromise = Order.countDocuments({ status: "delivered" });

    const allOrdersPromise = Order.find().select(["total", "discount", "tax", "shippingCharges", "subtotal"]);

    const [processingOrders, shippedOrders, deliveredOrders, allProductsCount, productCategories, inStockProducts, allOrders, allUsers] = await Promise.all([
        processingOrdersPromise,
        shippedOrdersPromise,
        deliveredOrdersPromise,
        Product.countDocuments(),
        Product.distinct("category"),
        Product.countDocuments({ stock: { $gt: 0 } }),
        allOrdersPromise,
        User.find().select(['dob', 'role']),
    ]);

    const orderStatusData = {
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders
    }

    const inventoryData = await getInventoryData(productCategories, allProductsCount);

    const stockRatio = {
        inStock: inStockProducts,
        outOfStock: allProductsCount - inStockProducts
    }

    const totalRevenue = allOrders.reduce((total, singleOrder) => total + (singleOrder.total || 0), 0);
    const totalDiscount = allOrders.reduce((total, singleOrder) => total + (singleOrder.discount || 0), 0);
    const burnt = allOrders.reduce((total, singleOrder) => total + (singleOrder.tax || 0), 0);
    const productionCost = allOrders.reduce((total, singleOrder) => total + (singleOrder.shippingCharges || 0), 0);
    const marketingCost = Math.round((totalRevenue * 30) / 100);
    const netMargin = totalRevenue - totalDiscount - burnt - productionCost - marketingCost;

    const revenueDistribution = {
        netMargin,
        marketingCost,
        totalDiscount,
        burnt,
        productionCost
    }

    const userAgeRatio = {
        teenage: allUsers.filter(user => user.age < 17).length,
        adult: allUsers.filter(user => user.age >= 17 && user.age < 40).length,
        old: allUsers.filter(user => user.age >= 40).length
    }

    const userRoleRatio = {
        admin: allUsers.filter(user => user.role === "admin").length,
        user: allUsers.filter(user => user.role === "user").length
    }

    pieCharts = {
        orderStatusData,
        inventoryData,
        stockRatio,
        revenueDistribution,
        userAgeRatio,
        userRoleRatio
    };

    return res.status(200).json({
        success: true,
        message: "Pie charts data fetched successfully",
        pieCharts
    });
});

const getLineChartsData = TryCatch(async (_, res, __) => {

    let lineCharts = {};

    const today = new Date();
    const tweleveMonthsAgo = new Date();
    tweleveMonthsAgo.setMonth(tweleveMonthsAgo.getMonth() - 12);

   const baseQuery = {
    createdAt: {
        $gte: tweleveMonthsAgo,
        $lte: today
    }
   }

    const [user, products, orders] = await Promise.all([
        User.find(baseQuery).select('createdAt'),
        Product.find(baseQuery).select('createdAt'),
        Order.find(baseQuery).select('createdAt total discount')
        
    ]);

    const usersChartData = getCharData({ length: 12, docArray: user, today });
    const productsChartData = getCharData({ length: 12, docArray: products, today });
    const revenueData = getCharData({ length: 12, docArray: orders, today, property: "total" });
    const discountData = getCharData({ length: 12, docArray: orders, today, property: "discount" });

    lineCharts = {
        usersChartData,
        productsChartData,
        revenueData,
        discountData
    };

    return res.status(200).json({
        success: true,
        message: "Line charts data fetched successfully",
        lineCharts
    });
});


export {
    getDashboardStats,
    getBarChartsData,
    getPieChartsData,
    getLineChartsData
}