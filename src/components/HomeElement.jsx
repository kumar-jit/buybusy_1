// Importing necessary dependencies and components
import { BeatLoader } from "react-spinners";
import { ProductCard } from "./Element/productCard/ProductCardElement";
import { Modal } from "./Element/modal/ModalElement";
import React, { useEffect, useState } from "react";
import { Search } from "./Element/SearchElement/SearchElment";
import { escapeRegExp } from "../utils/utils";
import { BiMenu } from "react-icons/bi";
import { FilterForm } from "./Element/FilterForm/FilterFormElement";
import { useCategoryCheckboxForm } from "../customHooks/filterCustomHooks";
import { fetchProductData } from "../Redux/Slice/ProductSlice";
import { connect } from "react-redux";
import { updateCartItem } from "../Redux/Slice/CartSlice";
import { useNavigate } from "react-router-dom";

// Component for Home Page
const HomeE = (props) => {
    // Local state declarations
    const [modelOpen, setModelOpen] = useState(false);
    const {
        productList,
        categories,
        isLoading,
        fetchProductData,
        isLoggedIn,
        loggedUserInfo,
        addItemToCart,
    } = props;
    const [localProductList, setLocalProductList] = useState([]);
    const { filterInput, updateFilter } = useCategoryCheckboxForm();
    const navigate = useNavigate();

    // Handler to close the modal
    const onModelClose = (event) => {
        setModelOpen(false);
    };

    // Handler for search input changes
    const onhandelSearchInputValueChange = (event) => {
        if (event) {
            event.preventDefault();
            if (!event.target.value) {
                setLocalProductList(productList);
                return;
            }
            let regExp = new RegExp(escapeRegExp(event.target.value), "i");
            let filteredProducts = productList.filter((product) =>
                regExp.test(product.name)
            );
            setLocalProductList(filteredProducts);
        }
    };

    // Add item to cart or redirect to login/signup
    function onAddItemToCart(product, qtyChange) {
        if (isLoggedIn)
            addItemToCart({
                userId: loggedUserInfo?.uid || "",
                qtyChange,
                product,
            });
        else navigate("/SignupOrLogin");
    }

    // Effect to filter products based on selected categories
    useEffect(() => {
        if (Object.keys(filterInput).length == 0)
            setLocalProductList(productList);
        else {
            let filteredProducts = productList.filter((product) =>
                filterInput[product.category] ? true : false
            );
            setLocalProductList(filteredProducts);
        }
    }, [filterInput]);

    // Effect to sync local product list when product list changes
    useEffect(() => {
        setLocalProductList(productList);
    }, [productList]);

    // Fetch products on initial component mount
    useEffect(() => {
        fetchProductData();
    }, []);

    return (
        <div>
            {/* Loader while fetching data */}
            {isLoading && (
                <div className="loadingCenter">
                    <BeatLoader
                        color="#512da8"
                        loading={isLoading}
                        speedMultiplier={1}
                        size={25}
                    />
                </div>
            )}
            {/* Render home content when data is ready */}
            {!isLoading && (
                <div className="homeContainer">
                    {/* Button to open category filter modal */}
                    <div className="filterbtnContainer">
                        <button
                            onClick={() => setModelOpen(true)}
                            className="filterButton"
                        >
                            <BiMenu size={20}></BiMenu>{" "}
                        </button>
                    </div>

                    {/* Search field for product search */}
                    <div className="searchfield">
                        <Search
                            onValueChange={onhandelSearchInputValueChange}
                        ></Search>
                    </div>

                    {/* Modal for category filters */}
                    {modelOpen && (
                        <div>
                            {" "}
                            <Modal
                                children={React.cloneElement(<FilterForm />, {
                                    data: categories,
                                    filterInput: filterInput,
                                    updateFilter: updateFilter,
                                })}
                                title={"Category"}
                                onClose={onModelClose}
                                open={modelOpen}
                            ></Modal>{" "}
                        </div>
                    )}

                    {/* List of Products */}
                    <div className="flex flexWarp flexJustifyStart">
                        {localProductList.map((element, index) => (
                            <ProductCard
                                key={index}
                                product={element}
                                categories={categories}
                                onAddToCart={onAddItemToCart}
                            ></ProductCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Map Redux state to component props
const mapStateToProps = (state) => ({
    productList: state.productReducer.productList,
    categories: state.productReducer.categories,
    isLoading: state.productReducer.isLoading,
    isLoggedIn: state.authReducer.isLoggedIn,
    loggedUserInfo: state.authReducer.loggedUserInfo,
});

// Map Redux actions to component props
const mapDispatchToProps = (dispatch) => ({
    fetchProductData: () => dispatch(fetchProductData()),
    addItemToCart: (arg) => dispatch(updateCartItem(arg)),
});

// Connect component to Redux and export
export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeE);
