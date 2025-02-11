import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";
import axios from "axios";
import { AllUserResponse, DeleteResponse, UserResponse } from '../../types/api-types';

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/` }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        loginUser: builder.mutation<UserResponse, User>({
            query: (body) => ({
                url: `new`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation<DeleteResponse, string>({
            query: (id) => ({
                url: `delete/${id}?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        getAllUser: builder.query<AllUserResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["User"],
        }),
    }),
});

export const getSingleUser = async(id: string) => {
    try {
        const { data }: { data: UserResponse} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/single/${id}`);        
        return data;
    } catch (error) {
        throw error;
    }
};


export const { useLoginUserMutation, useGetAllUserQuery, useDeleteUserMutation } = userApi;