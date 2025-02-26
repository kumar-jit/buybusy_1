import { createContext, useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useAuthContext } from "./AuthContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Db/connection";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export const cartContext = createContext();

export const useCartContext = () => {
    return useContext(cartContext);
}

export const CartContextProvider = ({children}) => {
    const [carts, setCarts] = useState({products : {}, totalPrice : 0});
    const [orders, setOrders] = useState([])
    const [isLoading, setIsloading] = useState(false);
    const { isLoggedIn, loggedUserInfo } = useAuthContext();
    const navigate = useNavigate();
   

    /* ---------------------------- db operation code --------------------------- */

    const updateCartItemInFirestore = async (productId, qtyChange, product, makeCartEmpty) => {
        try {

            // Reference to the user's cart document
            const userDocRef = doc(db, "users", loggedUserInfo.uid);
    
            // Fetch current data for the user (if you need it to calculate the new totalPrice)
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let updatedCart = userData?.cart || { products: {}, totalPrice: 0 };

                if(makeCartEmpty){
                    updatedCart = { products: {}, totalPrice: 0 };
                }
                else{

                    // Update the specific item in products
                    if (updatedCart.products[productId]) {
                        updatedCart.products[productId].qty += qtyChange;
                        updatedCart.totalPrice += (qtyChange * updatedCart?.products[productId].price);    // adding total price
                        if (updatedCart?.products[productId].qty <= 0) {
                            delete updatedCart?.products[productId]; // Remove product if qty is 0 or less
                        }
                        
                    } else if (qtyChange > 0) {
                        updatedCart.products[productId] = {
                            ...product,
                            qty: qtyChange
                        };
                        updatedCart.totalPrice += (qtyChange * product.price); // adding total price
                    }
        
                    // Recalculate totalPrice
                    const newTotalPrice = Object.values(updatedCart.products).reduce((total, item) => {
                        return total + (item.price * item.qty);  // Assuming price is a string, so we parse it
                    }, 0);

                    updatedCart.totalPrice = newTotalPrice;
                }
    
                // Update Firestore with the new product list and total price
                await updateDoc(userDocRef, {"cart" : updatedCart});

                // updating stae
                setCarts(updatedCart);
                console.log("Cart updated successfully");
            } else {
                console.log("No such user document!");
            }
        } catch (error) {
            console.log("Error updating cart item:", error);
        }
    };

    const addOrderToFirestore = async (newOrder) => {
        try {
    
            // Reference to the user's document
            const userDocRef = doc(db, "users", loggedUserInfo.uid);
    
            
            await updateDoc(userDocRef, {
                "orders": arrayUnion(newOrder) // Adds the newOrder object with its array of products
            });

            // Fetch the updated user document
            const updatedUserSnap = await getDoc(userDocRef);
            if(updatedUserSnap.exists()){
                setOrders(updatedUserSnap?.data()?.orders);
            }
            
            console.log("Order added successfully");
        } catch (error) {
            console.log("Error adding order:", error);
        }
    }

    const fetchUserData = async () => {
        if (!loggedUserInfo || !isLoggedIn) return;  // Ensure user is logged in before fetching data
        setIsloading(true);
        try {
            // Get Firestore instance and reference to the user's document
            const userDocRef = doc(db, "users", loggedUserInfo.uid);
            
            // Fetch the user document
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                // Get user data
                const userData = userDocSnap.data();
                
                // Set the carts and orders in state
                setCarts(userData.cart || { products: {}, totalPrice: 0 });
                setOrders(userData.orders || []);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error fetching user data: ", error);
        }
        finally{
            setIsloading(false);
        }
    };

    /* ----------------------------- State updation ----------------------------- */
    const updateCart = async (productId, qtyChange, product, makeCartEmpty) => {
        // const newCart = { ...carts };

        // if (newCart.products[productId]) {
        //     newCart.products[productId].qty += qtyChange;
        //     newCart.totalPrice += (qtyChange * newCart?.products[productId].price);    // adding total price
        //     if (newCart?.products[productId].qty <= 0) {
        //         delete newCart?.products[productId]; // Remove product if qty is 0 or less
        //     }
            
        // } else if (qtyChange > 0) {
        //     newCart.products[productId] = {
        //         ...product,
        //         qty: qtyChange
        //     };
        //     newCart.totalPrice += (qtyChange * product.price); // adding total price
        // }
        // await updateCartItemInFirestore(loggedUserInfo.uid, );

        updateCartItemInFirestore(productId,qtyChange,product, makeCartEmpty);  // updaing db
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
            toast.success("Product successfully added to cart")
        }
    };

    const removeItemFromCart = (product) => {
        if (product?.id) {
            if(carts.products[product.id]){
                 // removing items form cart, on update cart all qty will be removed 
                updateCart(product.id, carts.products[product.id].qty * -1 , carts.products[product.id])
                toast.success("Product successfully removed from the cart")
            }
                
        }
    };

    const removeAllFromCart = () =>{
        updateCart(undefined,undefined,undefined,true);
        toast.success("Order successfully placed")
    }

    const orderPlace = () => {
        if(carts.products){
            let newPurchesList = [...orders];

            let oderList = {
                date: new Date(),
                products: [],
                totalPrice: carts.totalPrice
            }
            // preparing oder object
            Object.keys(carts.products).forEach(key => {
                let product = carts.products[key];
                oderList.products.push({
                    "name": product.name,
                    "qty": product.qty,
                    "price": product.price,
                    "totalPrice": product.price * product.qty,
                    "id" : product.id
                })
            })

            // newPurchesList.push(oderList);

            // setOrders(newPurchesList);  // updating purches order list
            addOrderToFirestore(oderList);

            
            removeAllFromCart();    // removing all times from cart
        }
    }

    useEffect(() => {
        if(!isLoggedIn ){
            navigate("/SignupOrLogin");
        }
        fetchUserData();
    }, [loggedUserInfo]);  // Dependency array ensures this runs when the user state changes

    return (
        <cartContext.Provider value={{ incrementProductQty, decrementProductQty, addItemToCart, removeItemFromCart,orderPlace, carts, orders }}>
            {isLoading && (
                <div className="loadingCenter">
                    <BeatLoader color="#512da8" loading={isLoading} speedMultiplier={1} size={25} />
                </div>
            )}
            {!isLoading && children}
        </cartContext.Provider>
    );
};
