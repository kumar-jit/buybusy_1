import styles from "./OrderedListTableElement.module.css";

export const OrderTableElement = ({data}) => {
    return (
        <div className={styles.orderHistory_box}>
            <div className={styles.orderHistory_boxHead}>
                <h2> Ordered On :- {data.date || data.date || ""}</h2>
            </div>
            <div>
                <table>
                    <tbody>
                        <tr className={styles.tr}>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total Price</th>
                        </tr>
                        {data.products.map(product => 
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.qty}</td>
                                <td>{product.price}</td>
                                <td>{product.totalPrice}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3"></td>
                            <td>{data.totalPrice}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
