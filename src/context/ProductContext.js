import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../Db/connection";
import { BeatLoader } from "react-spinners";

export const productContext = createContext();

export const useProductContext = () => {
    const value = useContext(productContext);
    return value;
}

export const ProductContextProvider = ({ children }) => {
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsloading] = useState(false);

    const fetchData = async () => {
        setIsloading(true);
        try {
            // fetching products
            const productsPromise = new Promise((resolve, reject) => {
                onSnapshot(collection(db, "/products"), (snapShot) => {
                    const products = snapShot.docs.map((doc) => {
                        let obj = {
                            id: doc.id,
                            ...doc.data()
                        }
                        return obj;
                    });
                    setProductList(products);
                    resolve();
                }, reject);
            });

            // fetching category
            const categoriesPromise = new Promise((resolve, reject) => {
                onSnapshot(collection(db, "/category"), (snapShot) => {
                    const category = snapShot.docs.map((doc) => {
                        let obj = {
                            id: doc.id,
                            ...doc.data()
                        }
                        return obj;
                    });
                    setCategories(category);
                    resolve();
                }, reject);
            });

            await Promise.all([productsPromise, categoriesPromise]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsloading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <productContext.Provider value={{ productList, categories, isLoading }}>
            {isLoading && <div className="loadingCenter">
                <BeatLoader color="#512da8" loading={isLoading} speedMultiplier={1} size={25} />
            </div>}
            {!isLoading && children}
        </productContext.Provider>
    )
}