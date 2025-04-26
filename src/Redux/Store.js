

import { authReducer } from './Slice/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './Slice/ProductSlice';
import { CartReducers } from './Slice/CartSlice';

export const Store = configureStore({
    reducer : {authReducer,productReducer, CartReducers}
})