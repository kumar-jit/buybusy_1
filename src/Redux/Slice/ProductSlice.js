import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Db/connection";

const INITIAL_STATE = {
    productList: [],
    categories: [],
    isLoading: false,
};

// Real-time product and category fetch using onSnapshot
export const fetchProductData = createAsyncThunk(
    "product/fetchProductData",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // Use async-await with promises inside onSnapshot
            const productPromise = new Promise((resolve, reject) => {
                const unsubscribeProduct = onSnapshot(
                    collection(db, "products"),
                    (snapshot) => {
                        const products = snapshot.docs.map((doc) => {
                            const data = doc.data();

                            // Handle category field: if it's a DocumentReference, extract its ID
                            if (data.category && data.category.id) {
                                data.category = data.category.id; // Save only the category ID
                            }

                            return {
                                id: doc.id,
                                ...data,
                            };
                        });

                        dispatch(setProductList(products));
                        resolve(unsubscribeProduct);
                    },
                    reject
                );
            });

            const categoryPromise = new Promise((resolve, reject) => {
                const unsubscribeCategory = onSnapshot(
                    collection(db, "category"),
                    (snapshot) => {
                        const categories = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        dispatch(setCategories(categories));
                        resolve(unsubscribeCategory);
                    },
                    reject
                );
            });

            const unsubscribers = await Promise.all([productPromise, categoryPromise]);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: INITIAL_STATE,
    reducers: {
        setProductList: (state, action) => {
            state.productList = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = [...action.payload];
            // state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductData.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchProductData.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const productReducer = productSlice.reducer;
export const { setProductList, setCategories } = productSlice.actions;

export const selectProducts = (state) => state.product.productList;
export const selectCategories = (state) => state.product.categories;
export const selectProductLoading = (state) => state.product.isLoading;
