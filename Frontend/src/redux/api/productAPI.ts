import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cateogoriesResponse, DeleteResponse, getAllReviewsResponse, newCreationResponse, newProductResponse, ProductResponse, SearchProductResponse } from "../../types/api-types";
import { deleteProductParamsType, newProductBodyType, newReviewRequestType, SearchProductType, updateProductBodyType } from "../../types/types";

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
            query: ({ search, price, category, sort, page }) => {
                let baseQuery = `search-products?search=${search}&page=${page}`;
                if (price) baseQuery += `&price=${price}`;
                if (category) baseQuery += `&category=${category}`;
                if (sort) baseQuery += `&sort=${sort}`;
                return baseQuery;
            },
            providesTags: ["Product"],
        }),
        newProduct: builder.mutation<newProductResponse, newProductBodyType>({
            query: ({ formData, id }) => ({
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
            query: ({ formData, id, productId }) => ({
                url: `${productId}?id=${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<DeleteResponse, deleteProductParamsType>({
            query: ({ id, productId }) => ({
                url: `${productId}?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        newReview: builder.mutation<newCreationResponse, newReviewRequestType>({
            query: ({ rating, comment, userId, id }) => ({
                url: `new/review/${id}?userid=${userId}`,
                method: "POST",
                body: {
                    rating,
                    comment
                },
            }),
            invalidatesTags: ["Product"],
        }),
        deleteReview: builder.mutation<DeleteResponse, { id: string, userId: string }>({
            query: ({ id, userId }) => ({
                url: `delete/${id}?userid=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        getAllReviews: builder.query<getAllReviewsResponse, string>({
            query: (id) => `all/review/${id}`,
            providesTags: ["Product"],
        }),
    }),
});

export const { useLatestProductsQuery, useAllProductsQuery, useNewProductMutation, useSingleProductQuery, useUpdateProductMutation, useDeleteProductMutation, useGetCategoriesQuery, useGetSearchProductsQuery, useNewReviewMutation, useDeleteReviewMutation, useGetAllReviewsQuery } = productApi;