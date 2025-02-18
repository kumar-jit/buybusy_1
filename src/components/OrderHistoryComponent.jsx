import {OrderTableDisplay} from "./Element/OrderTable/OrderedListTableElement"



export const OrderHistoryComponent = () => {
    const dataLis = [{productName : "test",
        quantity : 1,
        price : 1200,
        totalPrice : 1200}]
    return (<OrderTableDisplay></OrderTableDisplay>)
}