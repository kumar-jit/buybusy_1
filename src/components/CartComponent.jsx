import { connect } from "react-redux";
import { useCartContext } from "../context/CartContex";
import { fetchUserCartAndOrders, placeOrder, updateCartItem } from "../Redux/Slice/CartSlice";
import { CartItemCard } from "./Element/CartItemCard/CartItemCardElement";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const CartsComponentE = (props) => {
    // const {
    //     incrementProductQty,
    //     decrementProductQty,
    //     removeItemFromCart,
    //     carts,
    //     orderPlace,
    // } = useCartContext();
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

    function incrementOrDecrementProduct(product, qty) {
        updateCart(product, qty)
    }

    function removeItemFromCart(product) {
        updateCart(product, carts.products[product.id].qty * -1)
    }

    function updateCart(product, qtyChange) {
        if(isLoggedIn)
            updateCartItem({userId : loggedUserInfo.uid, qtyChange, product})
        else navigate("/SignupOrLogin")
    }

    function orderPlace() {
        if(isLoggedIn)
            placeOrder({userId : loggedUserInfo.uid})
        else navigate("/SignupOrLogin")
    }

    useEffect( ()=> {
        if(isLoggedIn) fetchUserCartAndOrders(loggedUserInfo.uid)
        else navigate("/SignupOrLogin")
    },[])

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

const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
    loggedUserInfo: state.authReducer.loggedUserInfo,
    isLoading: state.CartReducers.isLoading,
    carts: state.CartReducers.cart,
    isUpdating: state.CartReducers.isUpdating,
    isPlacingOrder: state.CartReducers.isPlacingOrder,
});
const mapDispatchToProps = (dispatch) => ({
    fetchUserCartAndOrders: (userId) =>
        dispatch(fetchUserCartAndOrders(userId)),
    placeOrder: (arg) => dispatch(placeOrder(arg)),
    updateCartItem: (arg) => dispatch(updateCartItem(arg)),
});
export const CartsComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(CartsComponentE);
