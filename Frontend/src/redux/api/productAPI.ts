import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductResponse } from "../../types/api-types";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/product/` }),
    endpoints: (builder) => ({
        latestProducts: builder.query<ProductResponse, string>({
            query: () => ({
                url: 'latest-products',
                method: "GET",
            }),
        }),
        allProducts: builder.query<ProductResponse, string>({
            query: (id) => ({
                url: `all?id=${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useLatestProductsQuery, useAllProductsQuery } = productApi;