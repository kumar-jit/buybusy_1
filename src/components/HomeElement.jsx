
import { BeatLoader } from "react-spinners";
import { useProductContext } from "../context/ProductContext"
import { ProductCard } from "./Element/productCard/ProductCardElement"


export const Home = () => {
    const {productList,categories, isLoading} = useProductContext();
    return (
        <div>
            {isLoading && <div className="loadingCenter">
                <BeatLoader color="#512da8"  loading={isLoading} speedMultiplier={1} size={25} />
            </div>}
            {   !isLoading && 
                <div className="flex flexWarp flexJustifyEvenly">
                    {
                        productList.map( (element, index) => 
                            <ProductCard key={index} product={element} categories={categories}></ProductCard>
                        )
                    }
                </div>
            }
        </div>
        
        
    )
}

