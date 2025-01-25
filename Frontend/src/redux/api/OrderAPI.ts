import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrderResponse, DeleteResponse, OrderResponse } from "../../types/api-types";
import { Order, OrderUpdateAndDeleteType } from "../../types/types";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/order/` }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        newOrder: builder.mutation<OrderResponse, Order>({
            query: (body) => ({
                url: 'new',
                method: "POST",
                body,
            }),
            invalidatesTags: ["Order"],
        }),
        updateOrder: builder.mutation<OrderResponse, OrderUpdateAndDeleteType>({
            query: ({userId, orderId}) => ({
                url: `${orderId}?id=${userId}`,
                method: "PUT",
            }),
            invalidatesTags: ["Order"],
        }),
        deleteOrder: builder.mutation<DeleteResponse, OrderUpdateAndDeleteType>({
            query: ({userId, orderId}) => ({
                url: `${orderId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),
        getSingleOrder: builder.query<OrderResponse, string>({
            query: (orderId) => ({
                url: `${orderId}`,
                method: "GET",
            }),
            providesTags: ["Order"],
        }),
        getAllOrders: builder.query<AllOrderResponse, string>({
            query: (id) => ({
                url: `all?id=${id}`,
                method: "GET",
            }),
            providesTags: ["Order"],
        }),
        getMyOrders: builder.query<AllOrderResponse, string>({
            query: (id) => ({
                url: `my?id=${id}`,
                method: "GET",
            }),
            providesTags: ["Order"],
        }),
    }),
});

export const { useNewOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useGetSingleOrderQuery, useGetAllOrdersQuery, useGetMyOrdersQuery } = orderApi;