import { useCartContext } from "../context/CartContex"
import { OrderTableElement } from "./Element/OrderTable/OrderedListTableElement"



export const OrderHistoryComponent = () => {
    const {orders} = useCartContext();
    return (
        <div className="orderHistory_container">
            <div className="orderHistory_head">
                <h1>Order History</h1>
            </div>
            <div className="OrderHistory_body">
                {
                    orders?.map((item, index) => <OrderTableElement data={item} key={index}></OrderTableElement> )
                }
            </div>
        </div>
    )
}