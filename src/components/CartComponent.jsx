import { useCartContext } from "../context/CartContex"
import { CartItemCard } from "./Element/CartItemCard/CartItemCardElement"


export const CartsComponent = () =>{
    const {
        incrementProductQty,
        decrementProductQty,
        addItemToCart,
        removeItemFromCart,
        carts
    } = useCartContext();


    return(
        <div className="cartComp cartComp_container">
            <div className="cartComp_item_flex">
                <section className="cartComp_cart">
                    <h2 className="cartComp_section_heading">Order Summary</h2>
                    <div className="cartComp_cart_item_box">
                        {Object.keys(carts?.products).map( product => 
                            <CartItemCard key={carts?.products[product].id} onIncrement={incrementProductQty} onDecrement={decrementProductQty} onRemove={removeItemFromCart} item={carts.products[product]}></CartItemCard>
                        )}
                    </div>
                    <div className="cartComp_wrapper">
                        <div className="cartComp_amount">
                            <div className="cartComp_total">
                                <span>Total</span> <span>$ <span id="total">{carts?.totalPrice}</span></span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}