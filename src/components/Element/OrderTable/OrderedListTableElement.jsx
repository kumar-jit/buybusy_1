import styles from './Table.module.css'


export const OrderTableDisplay = () => {
    const data = []


    return (
        <div className={styles.table_container}>
            <table>
                <th>
                    <td>Product Name</td>
                    <td>Quantity</td>
                    <td>Price</td>
                    <td>Total Price</td>
                </th>
                <tr>
                    <td>First</td>
                    <td>1</td>
                    <td>200</td>
                    <td>200</td>
                </tr>
            </table>
        </div>
    )
}