// Importing necessary libraries and components
import { connect } from "react-redux";
import {
    fetchUserCartAndOrders,
    placeOrder,
    updateCartItem,
} from "../Redux/Slice/CartSlice";
import { CartItemCard } from "./Element/CartItemCard/CartItemCardElement";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";

// Main functional component
export const CartsComponentE = (props) => {
    // Destructuring props for better readability
    const {
        fetchUserCartAndOrders,
        placeOrder,
        updateCartItem,
        isLoggedIn,
        loggedUserInfo,
        isLoading,
        carts,
        isUpdating,
        isPlacingOrder,
    } = props;

    const navigate = useNavigate();

    // Function to increment or decrement product quantity
    function incrementOrDecrementProduct(product, qty) {
        updateCart(product, qty);
    }

    // Function to remove item from the cart
    function removeItemFromCart(product) {
        updateCart(product, carts.products[product.id].qty * -1);
    }

    // Function to update the cart
    function updateCart(product, qtyChange) {
        if (isLoggedIn)
            updateCartItem({ userId: loggedUserInfo.uid, qtyChange, product });
        else navigate("/SignupOrLogin");
    }

    // Function to place the order
    function orderPlace() {
        if (isLoggedIn) placeOrder({ userId: loggedUserInfo.uid });
        else navigate("/SignupOrLogin");
    }

    // Fetch cart and order details on component mount
    useEffect(() => {
        if (isLoggedIn) fetchUserCartAndOrders(loggedUserInfo.uid);
        else navigate("/SignupOrLogin");
    }, []);

    // Show loading spinner while loading data
    if (isLoading) {
        return (
            <div className="cartComp cartComp_container">
                <div className="loadingCenter">
                    <BeatLoader
                        color="#512da8"
                        loading={isLoading}
                        speedMultiplier={1}
                        size={25}
                    />
                </div>
            </div>
        );
    } 
    // Show processing message while placing order
    else if (isPlacingOrder) {
        return (
            <div className="cartComp cartComp_container">
                <h1 className="loadingCenter">Order is processing...</h1>
            </div>
        );
    }

    // Main UI rendering
    return (
        <div className="cartComp cartComp_container">
            <div className="cartComp_item_flex">
                {Object.keys(carts?.products).length == 0 ? (
                    <h1 className="noItemCenter">Cart is Empty!</h1>
                ) : (
                    <section className="cartComp_cart">
                        <h2 className="cartComp_section_heading">
                            Order Summary
                        </h2>
                        <div className="cartComp_cart_item_box">
                            {Object.keys(carts?.products).map((product) => (
                                <CartItemCard
                                    key={carts?.products[product].id}
                                    onIncAndDec={incrementOrDecrementProduct}
                                    onRemove={removeItemFromCart}
                                    item={carts.products[product]}
                                    isUpdating={isUpdating}
                                ></CartItemCard>
                            ))}
                        </div>
                        <div className="cartComp_wrapper">
                            <div className="cartComp_amount">
                                <div className="cartComp_total">
                                    <div className="cartComp_totalAmmount">
                                        <span>Total</span>
                                        <span>=</span>
                                        <span>
                                            ${" "}
                                            <span id="total">
                                                {carts?.totalPrice}
                                            </span>
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => orderPlace()}
                                        className="cartComp__placeOrdbtn"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

// Mapping redux state to component props
const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
    loggedUserInfo: state.authReducer.loggedUserInfo,
    isLoading: state.CartReducers.isLoading,
    carts: state.CartReducers.cart,
    isUpdating: state.CartReducers.isUpdating,
    isPlacingOrder: state.CartReducers.isPlacingOrder,
});

// Mapping redux dispatch actions to component props
const mapDispatchToProps = (dispatch) => ({
    fetchUserCartAndOrders: (userId) =>
        dispatch(fetchUserCartAndOrders(userId)),
    placeOrder: (arg) => dispatch(placeOrder(arg)),
    updateCartItem: (arg) => dispatch(updateCartItem(arg)),
});

// Connecting component to Redux store
export const CartsComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(CartsComponentE);
