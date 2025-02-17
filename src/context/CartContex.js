import { createContext, useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useAuthContext } from "./AuthContext";

export const cartContext = createContext();

export const useCartContext = () => {
    return useContext(cartContext);
}

export const CartContextProvider = ({children}) => {
    const [carts, setCarts] = useState({products : {}, totalPrice : 0});
    const [isLoading, setIsloading] = useState(false);
    const { isLoggedIn, loggedUserInfo } = useAuthContext();

    const updateCart = (productId, qtyChange, product) => {
        const newCart = { ...carts };

        if (newCart.products[productId]) {
            newCart.products[productId].qty += qtyChange;
            newCart.totalPrice += (qtyChange * newCart?.products[productId].price);    // adding total price
            if (newCart?.products[productId].qty <= 0) {
                delete newCart?.products[productId]; // Remove product if qty is 0 or less
            }
            
        } else if (qtyChange > 0) {
            newCart.products[productId] = {
                ...product,
                qty: qtyChange
            };
            newCart.totalPrice += (qtyChange * product.price); // adding total price
        }
        setCarts(newCart);  // settin state
    };

    const incrementProductQty = (product) => {
        if (product?.id) {
            updateCart(product.id, 1);
        }
    };

    const decrementProductQty = (product) => {
        if (product?.id) {
            updateCart(product.id, -1);
        }
    };

    const addItemToCart = (product) => {
        if (product?.id) {
            updateCart(product.id, 1, product);
        }
    };

    const removeItemFromCart = (product) => {
        if (product?.id) {
            if(carts.products[product.id]){
                const newCart = { ...carts };
                newCart.totalPrice -= newCart.products[product.id].qty * newCart.products[product.id].price;    // reducing the product price
                delete newCart.products[product.id];    // removing the product from list
                setCarts(newCart);
            }
                
        }
    };

    return (
        <cartContext.Provider value={{ incrementProductQty, decrementProductQty, addItemToCart, removeItemFromCart, carts }}>
            {isLoading && (
                <div className="loadingCenter">
                    <BeatLoader color="#512da8" loading={isLoading} speedMultiplier={1} size={25} />
                </div>
            )}
            {!isLoading && children}
        </cartContext.Provider>
    );
};
