import { authReducer } from "./Slice/AuthSlice";
import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./Slice/ProductSlice";
import { CartReducers } from "./Slice/CartSlice";
import toastMiddleware from "./middleware/toastMsgMiddleware";

export const Store = configureStore({
    reducer: { authReducer, productReducer, CartReducers },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(toastMiddleware),
});
