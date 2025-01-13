import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userAPI";
import { userReducer } from "./reducers/userReducer";
import { productApi } from "./api/productAPI";

export const store = configureStore({
    reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userReducer.name]: userReducer.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware).concat(productApi.middleware),  
});

export type RootState = ReturnType<typeof store.getState>;