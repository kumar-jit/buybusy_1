import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../Db/connection";
import { toast } from "react-toastify";

// --- Async Thunks (for Firestore operations) ---

// Thunk to fetch initial user cart and orders
export const fetchUserCartAndOrders = createAsyncThunk(
    "cart/fetchUserData",
    async (userId, { rejectWithValue }) => {
        if (!userId) {
            // Don't fetch if no user ID is provided
            return rejectWithValue("No user ID provided.");
        }
        try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                userData.orders = userData.orders?.map((order) => {
                    order.date =
                        (typeof order.date == "object"
                            ? order.date?.toDate()?.toLocaleDateString()
                            : order.date) || "";
                    return order;
                });
                return {
                    cart: userData.cart || { products: {}, totalPrice: 0 },
                    orders: userData.orders || [],
                };
            } else {
                return {
                    cart: { products: {}, totalPrice: 0 },
                    orders: [],
                };
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to update a cart item (add, increment, decrement, remove)
export const updateCartItem = createAsyncThunk(
    "cart/updateItem",
    async (
        { userId, qtyChange, product = null, makeCartEmpty = false },
        { getState, rejectWithValue }
    ) => {
        let productId = product?.id || null;
        if (!userId) return rejectWithValue("User not logged in"); // Guard clause

        try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef); // Get fresh data

            if (!userDocSnap.exists()) {
                return rejectWithValue("User document not found");
            }

            const userData = userDocSnap.data();
            let updatedCart = userData?.cart || { products: {}, totalPrice: 0 };

            if (makeCartEmpty) {
                updatedCart = { products: {}, totalPrice: 0 };
            } else if (productId) {
                // Ensure products object exists
                updatedCart.products = updatedCart.products || {};

                if (updatedCart.products[productId]) {
                    const currentItem = updatedCart.products[productId];
                    const newQty = currentItem.qty + qtyChange;

                    if (newQty <= 0) {
                        // Remove item
                        delete updatedCart.products[productId];
                    } else {
                        // Update quantity
                        updatedCart.products[productId] = {
                            ...currentItem,
                            qty: newQty,
                        };
                    }
                } else if (qtyChange > 0 && product) {
                    // Add new item
                    updatedCart.products[productId] = {
                        ...product,
                        qty: qtyChange,
                    };
                }

                // Recalculate totalPrice *after* modifications
                updatedCart.totalPrice = Object.values(
                    updatedCart.products
                ).reduce((total, item) => total + item.price * item.qty, 0);
                if (qtyChange > 0) {
                    toast.success("Item added to cart");
                } else if (qtyChange < 0) {
                    toast.success("Item remove from cart");
                }
            } else {
                return rejectWithValue(
                    "Invalid operation: Missing product ID or makeCartEmpty flag."
                );
            }

            await updateDoc(userDocRef, { cart: updatedCart });
            return updatedCart; // Return the updated cart state
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to place an order
export const placeOrder = createAsyncThunk(
    "cart/placeOrder",
    async ({ userId }, { getState, dispatch, rejectWithValue }) => {
        if (!userId) return rejectWithValue("User not logged in");

        const state = getState();
        const currentCart = state.CartReducers.cart; // Access cart state correctly

        if (!currentCart || Object.keys(currentCart.products).length === 0) {
            return rejectWithValue("Cart is empty");
        }

        try {
            const userDocRef = doc(db, "users", userId);

            // 1. Prepare the new order object
            const newOrder = {
                date: new Date().toLocaleDateString() || "", // Store as ISO string for consistency
                totalPrice: currentCart.totalPrice,
                products: Object.values(currentCart.products).map(
                    (product) => ({
                        name: product.name,
                        qty: product.qty,
                        price: product.price,
                        totalPrice: product.price * product.qty,
                        id: product.id,
                    })
                ),
            };

            // 2. Add the order to Firestore
            await updateDoc(userDocRef, {
                orders: arrayUnion(newOrder),
            });

            // 3. Clear the cart in Firestore by dispatching the updateCartItem thunk
            // We dispatch another thunk here to keep the logic separated
            await dispatch(
                updateCartItem({ userId, makeCartEmpty: true })
            ).unwrap(); // unwrap handles potential rejection

            // 4. Fetch the updated orders list (optional, could return from backend if needed)
            const updatedUserSnap = await getDoc(userDocRef);
            const updatedOrders = updatedUserSnap.exists()
                ? updatedUserSnap.data().orders
                : [];

            updatedOrders.forEach((order) => {
                order.date =
                    (typeof order.date == "object"
                        ? order.date?.toDate()?.toLocaleDateString()
                        : order.date) || "";
            });
            return { newOrders: updatedOrders }; // Return updated orders
        } catch (error) {
            return rejectWithValue(error.message || "Failed to place order");
        }
    }
);

// --- Slice Definition ---

const initialState = {
    cart: {
        products: {},
        totalPrice: 0,
    },
    orders: [],
    isLoading: false, // For general loading state, e.g., initial fetch
    isUpdating: false, // For cart item updates
    isPlacingOrder: false, // For order placement
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Optional: Synchronous reducers if needed, e.g., clear local error state
        clearCartError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch User Data ---
            .addCase(fetchUserCartAndOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserCartAndOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload.cart;
                state.orders = action.payload.orders;
            })
            .addCase(fetchUserCartAndOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch user data";
                state.cart = { products: {}, totalPrice: 0 };
                state.orders = [];
            })

            // --- Update Cart Item ---
            .addCase(updateCartItem.pending, (state) => {
                state.isUpdating = true; // Indicate specific update loading
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.cart = action.payload; // Update local cart state with the result from Firestore
                state.error = null;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload || "Failed to update cart";
            })

            // --- Place Order ---
            .addCase(placeOrder.pending, (state) => {
                state.isPlacingOrder = true;
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.isPlacingOrder = false;
                state.cart = { products: {}, totalPrice: 0 }; // Clear local cart state
                state.orders = action.payload.newOrders; // Update local orders
                state.error = null;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.isPlacingOrder = false;
                state.error = action.payload || "Failed to place order";
            });
    },
});

export const { clearCartError } = cartSlice.actions;
export const CartReducers = cartSlice.reducer;

// --- Selectors (optional but recommended) ---
export const selectCartItems = (state) => state.CartReducers.products;
export const selectCartTotalPrice = (state) => state.CartReducers.totalPrice;
export const selectCart = (state) => state.CartReducers;
export const selectOrders = (state) => state.CartReducers.orders;
export const selectIsCartLoading = (state) => state.CartReducers.isLoading;
export const selectIsCartUpdating = (state) => state.CartReducers.isUpdating;
export const selectIsPlacingOrder = (state) =>
    state.CartReducers.isPlacingOrder;
export const selectCartError = (state) => state.CartReducers.error;
