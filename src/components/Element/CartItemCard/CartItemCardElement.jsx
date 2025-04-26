
import { IoIosAdd } from "react-icons/io";
import { HiMiniMinusSmall } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";

import styles from './CartItemCard.module.css'



export const CartItemCard = ({onIncAndDec,onRemove,item}) => {
    return (
        <div className={ styles.product_card }>
            <div className={ styles.card }>
                <div className={ styles.img_box }>
                    <img src={item.image[0]} alt="cabbage" width="80px" className={ styles.product_img } />
                </div>

                <div className={ styles.detail }>

                    <h4 className={ styles.product_name }>{item.name}</h4>

                    <div className={ styles.wrapper }>

                        <div className={ styles.product_qty }>
                            <button id="decrement" onClick={() => onIncAndDec(item,-1)}>
                                <HiMiniMinusSmall size={50} className={styles.decIncBtn}></HiMiniMinusSmall>
                            </button>

                            <span id="quantity">{item.qty}</span>

                            <button id="increment" onClick={() => onIncAndDec(item,1)}>
                                <IoIosAdd size={50} className={styles.decIncBtn}></IoIosAdd>
                            </button>
                        </div>

                        <div className={ styles.price}>
                            <span id="price">{"$ " + item.price}</span>
                        </div>
                    </div>
                </div>
                <button className={ styles.product_close_btn } onClick={() => onRemove(item)}>
                    <RxCross2 size={30} className={styles.removeBtn}></RxCross2>
                </button>
            </div>
        </div>
    )
}