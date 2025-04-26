import { toast } from "react-toastify"; // Import toast notification library (Make sure to install it: npm install react-toastify)

// Custom Redux middleware to show toast notifications based on action types
const toastMiddleware = (store) => (next) => (action) => {
    const result = next(action); // Pass action to the next middleware or reducer

    // Handle specific action types and show corresponding toast notifications
    switch (action.type) {
        // Successful signup
        case "auth/handleSignUp/fulfilled":
            toast.success("Successfully signed up!");
            break;

        // Failed signup
        case "auth/handleSignUp/rejected":
            toast.error(
                `Sign Up Failed: ${
                    action.payload || "An unknown error occurred"
                }`
            );
            break;

        // Successful signin
        case "auth/handleSignIn/fulfilled":
            toast.success("Successfully signed in!");
            break;

        // Failed signin
        case "auth/handleSignIn/rejected":
            toast.error(
                `Sign In Failed: ${
                    action.payload || "An unknown error occurred"
                }`
            );
            break;

        // Logout action
        case "auth/handleLogout":
            toast.success("Logged Out!");
            break;

        // Failed cart update
        case "cart/updateCartItem/rejected":
            toast.success("Failed to update cart");
            break;

        // Successful order placement
        case "cart/placeOrder/fulfilled":
            toast.success("Order placed successfully");
            break;

        // Failed order placement
        case "cart/placeOrder/rejected":
            toast.success("Failed to place order");
            break;

        // Default case: do nothing
        default:
            break;
    }

    return result; // Return the result of next(action)
};

export default toastMiddleware; // Export the middleware
