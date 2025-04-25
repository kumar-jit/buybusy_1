

import { authReducer } from './Slice/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';

export const Store = configureStore({
    reducer : {authReducer}
})