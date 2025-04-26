import { useEffect } from "react";
import { fetchUserCartAndOrders } from "../Redux/Slice/CartSlice";
import { OrderTableElement } from "./Element/OrderTable/OrderedListTableElement";
import { connect } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const OrderHistoryComponentE = ({
    isLoggedIn,
    loggedUserInfo,
    orders,
    isLoading,
    fetchUserCartAndOrders,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) fetchUserCartAndOrders(loggedUserInfo.uid);
        else navigate("/SignupOrLogin");
    }, []);

    if (isLoading) {
        return (
            <div className="loadingCenter">
                <BeatLoader
                    color="#512da8"
                    loading={isLoading}
                    speedMultiplier={1}
                    size={25}
                />
            </div>
        );
    }

    return orders?.length == 0 ? (
        <h2 className="noItemCenter">No Orders Found!</h2>
    ) : (
        <div className="orderHistory_container">
            <div className="orderHistory_head">
                <h1>Order History</h1>
            </div>
            <div className="OrderHistory_body">
                {orders?.map((item, index) => (
                    <OrderTableElement
                        data={item}
                        key={index}
                    ></OrderTableElement>
                ))}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
    loggedUserInfo: state.authReducer.loggedUserInfo,
    orders: state.CartReducers.orders,
    isLoading: state.CartReducers.isLoading,
});
const mapDispatchToProps = (dispatch) => ({
    fetchUserCartAndOrders: (userId) =>
        dispatch(fetchUserCartAndOrders(userId)),
});
export const OrderHistoryComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderHistoryComponentE);
