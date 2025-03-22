import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userAPI";
import { userReducer } from "./reducers/userReducer";
import { productApi } from "./api/productAPI";
import { cartReducer } from "./reducers/cartReducer";
import { couponApi } from "./api/couponAPI";
import { orderApi } from "./api/OrderAPI";
import { dashboardApi } from "./api/dashboardAPI";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware).concat(productApi.middleware).concat(couponApi.middleware).concat(orderApi.middleware).concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;