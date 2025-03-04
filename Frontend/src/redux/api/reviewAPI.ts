import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DeleteResponse, getAllReviewsResponse, newCreationResponse } from '../../types/api-types';
import { newReviewRequestType } from "../../types/types";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/review/` }),
    tagTypes: ["Review"],
    endpoints: (builder) => ({
        newReview: builder.mutation<newCreationResponse, newReviewRequestType>({
            query: ({rating, comment, userId, productId}) => ({
                url: `new/${productId}?userid=${userId}`,
                method: "POST",
                body: {
                    rating,
                    comment
                },
            }),
            invalidatesTags: ["Review"],
        }),
        deleteReview: builder.mutation<DeleteResponse, {reviewId: string, userId: string}>({
            query: ({reviewId, userId}) => ({
                url: `delete/${reviewId}?userid=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Review"],
        }),
        getAllReviews: builder.query<getAllReviewsResponse, string>({
            query: (id) => `all/${id}`,
            providesTags: ["Review"],
        }),
    }),
});

export const { useNewReviewMutation, useGetAllReviewsQuery, useDeleteReviewMutation } = reviewApi;