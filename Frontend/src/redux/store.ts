import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userAPI";
import { userReducer } from "./reducers/userReducer";
import { productApi } from "./api/productAPI";
import { cartReducer } from "./reducers/cartReducer";
import { couponApi } from "./api/couponAPI";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware).concat(productApi.middleware).concat(couponApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;