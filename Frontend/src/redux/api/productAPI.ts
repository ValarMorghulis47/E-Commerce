import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cateogoriesResponse, DeleteResponse, newProductResponse, ProductResponse, SearchProductResponse } from "../../types/api-types";
import { deleteProductParamsType, newProductBodyType, SearchProductType, updateProductBodyType } from "../../types/types";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/product/` }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<ProductResponse, string>({
            query: () => ({
                url: 'latest-products',
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        allProducts: builder.query<ProductResponse, string>({
            query: (id) => ({
                url: `all?id=${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        getCategories: builder.query<cateogoriesResponse, string>({
            query: () => ({
                url: 'category',
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        getSearchProducts: builder.query<SearchProductResponse, SearchProductType>({
            query: ({search, price, category, sort, page}) => {
                let baseQuery = `search-products?search=${search}&page=${page}`;
                if (price) baseQuery += `&price=${price}`;
                if (category) baseQuery += `&category=${category}`;
                if (sort) baseQuery += `&sort=${sort}`;
                return baseQuery;
            },
            providesTags: ["Product"],
        }),
        newProduct: builder.mutation<newProductResponse, newProductBodyType>({
            query: ({formData, id}) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),
        singleProduct: builder.query<newProductResponse, string>({
            query: (id) => ({
                url: `${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        updateProduct: builder.mutation<newProductResponse, updateProductBodyType>({
            query: ({formData, id, productId}) => ({
                url: `${productId}?id=${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<DeleteResponse, deleteProductParamsType>({
            query: ({id, productId}) => ({
                url: `${productId}?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    }),
});

export const { useLatestProductsQuery, useAllProductsQuery, useNewProductMutation, useSingleProductQuery, useUpdateProductMutation, useDeleteProductMutation, useGetCategoriesQuery, useGetSearchProductsQuery } = productApi;