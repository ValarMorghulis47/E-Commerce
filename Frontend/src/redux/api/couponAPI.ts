import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCouponResponse, ApplyCouponResponse, CouponResponse, DeleteResponse } from "../../types/api-types";
import { CouponApplyBodyType, newCouponBodyType, singleCouponRequestType, updateCouponBodyType } from "../../types/types";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/` }),
    tagTypes: ["Coupon"],
    endpoints: (builder) => ({
        applyCoupon: builder.mutation<ApplyCouponResponse, CouponApplyBodyType>({
            query: (body) => ({
                url: 'apply',
                method: "POST",
                body,
            }),
        }),
        getAllCoupon: builder.query<AllCouponResponse, string>({
            query: (id) => ({
                url: `/all?id=${id}`,
                method: "GET"
            }),
            providesTags: ["Coupon"]
        }),
        updateCoupon: builder.mutation<CouponResponse, updateCouponBodyType>({
            query: ({body, id, couponId}) => ({
                url: `coupon/${couponId}?id=${id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["Coupon"]
        }),
        getSingleCoupon: builder.query<CouponResponse, singleCouponRequestType>({
            query: ({id, couponId}) => ({
                url: `/coupon/${couponId}?id=${id}`,
                method: "GET"
            }),
            providesTags: ["Coupon"]
        }),
        deleteCoupon: builder.mutation<DeleteResponse, singleCouponRequestType>({
            query: ({id, couponId}) => ({
                url: `/coupon/${couponId}?id=${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Coupon"]
        }),
        newCoupon: builder.mutation<CouponResponse, newCouponBodyType>({
            query: ({body, id}) => ({
                url: `/new?id=${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Coupon"]
        }),
    }),
});

export const { useApplyCouponMutation, useGetAllCouponQuery, useUpdateCouponMutation, useGetSingleCouponQuery, useDeleteCouponMutation, useNewCouponMutation } = couponApi;