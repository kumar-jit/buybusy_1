

import { authReducer } from './Slice/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './Slice/ProductSlice';

export const Store = configureStore({
    reducer : {authReducer,productReducer}
})