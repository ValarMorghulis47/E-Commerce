import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApplyCouponResponse } from "../../types/api-types";
import { CouponApplyBodyType } from "../../types/types";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/` }),
    endpoints: (builder) => ({
        applyCoupon: builder.mutation<ApplyCouponResponse, CouponApplyBodyType>({
            query: (body) => ({
                url: 'apply',
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useApplyCouponMutation } = couponApi;