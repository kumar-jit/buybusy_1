
import { BeatLoader } from "react-spinners";
import { useProductContext } from "../context/ProductContext"
import { ProductCard } from "./Element/productCard/ProductCardElement"
import { useCartContext } from "../context/CartContex";
import { Modal } from "./Element/modal/ModalElement";
import React, { useEffect, useState } from "react";
import { Search } from "./Element/SearchElement/SearchElment";
import { escapeRegExp } from "../utils/utils";
import { BiMenu } from "react-icons/bi";
import { FilterForm } from "./Element/FilterForm/FilterFormElement";
import { useCategoryCheckboxForm } from "../customHooks/filterCustomHooks";

export const Home = () => {
    const[modelOpen, setModelOpen] = useState(false);
    const {productList,categories, isLoading} = useProductContext();
    const [localProductList, setLocalProductList] = useState([]);
    const {addItemToCart} = useCartContext();
    const { filterInput,updateFilter} = useCategoryCheckboxForm();

    const onModelClose = (event) => {
        setModelOpen(false);
    }

    const onhandelSearchInputValueChange = (event) =>{
        if(event){
            event.preventDefault();
            if(!event.target.value){
                setLocalProductList(productList); return;
            }
            let regExp = new RegExp(escapeRegExp(event.target.value), 'i');
            let filteredProducts = productList.filter(product => regExp.test(product.name));
            setLocalProductList(filteredProducts);
        }
    }

    useEffect(() => {
        console.log("tiuseEffect form Home")
        if(Object.keys(filterInput).length == 0)
            setLocalProductList(productList);
        else{
            let filteredProducts = productList.filter(product => filterInput[product.category.id]? true : false);
            setLocalProductList(filteredProducts);
        }
    }, [filterInput]);

    useEffect( () => {
        setLocalProductList(productList);
    },[productList])

    

    return (
        <div>
            {isLoading && <div className="loadingCenter">
                <BeatLoader color="#512da8"  loading={isLoading} speedMultiplier={1} size={25} />
            </div>}
            {   !isLoading &&
                <div className="homeContainer">
                    <div className="filterbtnContainer">
                            <button onClick={() => setModelOpen(true)} className="filterButton"><BiMenu size={20}></BiMenu> </button>
                    </div>
                    <div className="searchfield">
                        <Search onValueChange={onhandelSearchInputValueChange} ></Search>
                    </div>
                    
                    { modelOpen && <div> <Modal children={React.cloneElement(<FilterForm />, { data: categories, filterInput: filterInput, updateFilter : updateFilter})} title={"Category"} onClose={onModelClose} open={modelOpen}></Modal> </div>}
                    <div className="flex flexWarp flexJustifyEvenly">
                        {
                            localProductList.map( (element, index) => 
                                <ProductCard key={index} product={element} categories={categories} onAddToCart={addItemToCart}></ProductCard>
                            )
                        }
                    </div>    
                </div> 
            }
        </div>
    )
}

