import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
    updateProfile,
    reload,
} from "firebase/auth";
import { db } from "../../Db/connection";
import { doc, setDoc } from "firebase/firestore";

// Helper to get user info from localStorage
const getUserFromLocalStorage = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user"); // Clear corrupted data
        return null;
    }
};

const localUserInfo = getUserFromLocalStorage();

// Initial state of the auth slice
const INITIAL_STATE = {
    isLoggedIn: !!localUserInfo, // More concise check
    loggedUserInfo: localUserInfo,
    // Add loading/error states for better UI feedback
    isLoading: false,
    error: null,
};

// Async thunk for handling user sign-up
export const handleSignUp = createAsyncThunk(
    "auth/handleSignUp",
    async (arg, thankAPI) => {
        let { email, password, fullName } = arg;
        try {
            const authInstance = getAuth();

            // Create user with email and password
            let auth = await createUserWithEmailAndPassword(
                authInstance,
                email,
                password
            );
            const user = auth.user;

            // Set display name for the newly created user
            await updateProfile(user, {
                displayName: fullName,
            });

            // Reload user to reflect updated displayName
            await reload(user);

            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                name: fullName, // Ensure fullName is passed correctly to avoid Firestore error
                cart: { products: {}, totalPrice: 0 },
                orders: [],
            });

            // Create a simplified user object
            let signUpuser = {
                accessToken: user.accessToken,
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
            };

            // Dispatch user info to Redux store
            thankAPI.dispatch(setLoggedUserInfo(signUpuser));
            return true;
        } catch (error) {
            thankAPI.dispatch(setLoggedUserInfo(null));
            return false;
        }
    }
);

// Async thunk for handling user sign-in
export const handleSignIn = createAsyncThunk(
    "auth/handleSignIn",
    async (arg, thankAPI) => {
        let { email, password } = arg;
        try {
            const authInstance = getAuth();

            // Sign in user with email and password
            let auth = await signInWithEmailAndPassword(
                authInstance,
                email,
                password
            );

            // Simplified user object
            let user = {
                accessToken: auth.user?.accessToken,
                displayName: auth.user?.displayName,
                email: auth.user?.email,
                uid: auth.user?.uid,
            };

            // Dispatch user info to Redux store
            thankAPI.dispatch(setLoggedUserInfo(user));
            console.info(auth);
            return true;
        } catch (error) {
            thankAPI.dispatch(thankAPI.setLoggedUserInfo(null)); // Potential mistake: should be `thankAPI.dispatch(setLoggedUserInfo(null))`
            return false;
        }
    }
);

// Auth slice definition
export const AuthSlice = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,
    reducers: {
        // Initializes auth state from localStorage
        setInitialState: (state, action) => {
            if (action.payload != null) {
                state.isLoggedIn = true;
                state.loggedUserInfo = action.payload;
            } else {
                state.isLoggedIn = false;
                state.loggedUserInfo = null;
            }
        },
        // Updates login status
        setIsloggedIn: (state, action) => (state.isLoggedIn = action.payload),

        // Stores logged user info and updates localStorage
        setLoggedUserInfo: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            if (action.payload == null) state.isLoggedIn = false;
            else state.isLoggedIn = true;

            state.loggedUserInfo = action.payload;
            return state;
        },
        // Clears user info and login status on logout
        handleLogout: (state, action) => {
            localStorage.setItem("user", null);
            state.isLoggedIn = false;
            state.loggedUserInfo = null;
            return state;
        },
    },
});

// Exports
export const authReducer = AuthSlice.reducer;
export const {
    setInitialState,
    setIsloggedIn,
    setLoggedUserInfo,
    handleLogout,
} = AuthSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectLoggedUserInfo = (state) => state.auth.loggedUserInfo;
