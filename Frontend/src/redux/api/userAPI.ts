import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserResponse } from "../../types/userAPI-types";
import { User } from "../../types/types";
import axios from "axios";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/` }),
    endpoints: (builder) => ({
        loginUser: builder.mutation<UserResponse, User>({
            query: (body) => ({
                url: `new`,
                method: "POST",
                body,
            }),
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


export const { useLoginUserMutation } = userApi;