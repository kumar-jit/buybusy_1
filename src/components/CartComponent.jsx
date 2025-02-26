import { useCartContext } from "../context/CartContex";
import { CartItemCard } from "./Element/CartItemCard/CartItemCardElement";

export const CartsComponent = () => {
    const {
        incrementProductQty,
        decrementProductQty,
        removeItemFromCart,
        carts,
        orderPlace,
    } = useCartContext();

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
                                    onIncrement={incrementProductQty}
                                    onDecrement={decrementProductQty}
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
                                    
                                    <button onClick={() => orderPlace()} className="cartComp__placeOrdbtn">
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
