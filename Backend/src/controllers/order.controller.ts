import { Request } from "express";
import { TryCatch } from "../middlewares/error.middleware.js";
import { newOrderRequest } from "../types/types.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Order } from "../models/order.model.js";
import { reduceStock } from "../utils/features.js";


const newOrder = TryCatch(async (req: Request<{}, {}, newOrderRequest>, res, next) => {

    const { orderItems, shippingInfo, subtotal, tax, discount, shippingCharges, total, user, status } = req.body;
    if (!orderItems || orderItems.length === 0) {
        return next(new ErrorHandler("Please add some items to your cart", 400));
    }
    if (!shippingInfo || !subtotal || !tax || !discount || !shippingCharges || !total || !user || !status) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    // const newOrder = await Order.create({
    //     orderItems,
    //     shippingInfo,
    //     subtotal,
    //     tax,
    //     discount,
    //     shippingCharges,
    //     total,
    //     user,
    //     status
    // });
    // if (!newOrder) {
    //     return next(new ErrorHandler("Order could not be placed", 400));
    // }

    // await reduceStock(orderItems);

    const [newOrder, _] = await Promise.all([
        Order.create({
            orderItems,
            shippingInfo,
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user,
            status
        }),
        reduceStock(orderItems)
    ])

    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: newOrder
    });
});

const processOrder = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    switch (order.status) {
        case 'Processing':
            order.status = 'Shipped';
            break;
        case 'Shipped':
            order.status = 'Delivered';
            break;
        default:
            order.status = 'Delivered';
            break;
    }

    await order.save();

    return res.status(200).json({
        success: true,
        message: "Order processed successfully",
        order
    });

});

const deleteOrder = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    await order.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});

const getSingleOrder = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name');
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Order found Successfully",
        order
    });
});

const getAllOrders = TryCatch(async (req, res, next) => {

    const orders = await Order.find().populate('user', 'name');
    if (!orders) {
        return next(new ErrorHandler("No orders found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "All orders found Successfully",
        orders
    });
});

const getMyOrders = TryCatch(async (req, res, next) => {

    const { id:user } = req.query;
    const orders = await Order.find({user});
    if (!orders) {
        return next(new ErrorHandler("No orders found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "My orders fetched Successfully",
        orders
    });
});


export {
    newOrder,
    processOrder,
    deleteOrder,
    getSingleOrder,
    getAllOrders,
    getMyOrders
}