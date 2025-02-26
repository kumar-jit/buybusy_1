import { useProductContext } from '../../../context/ProductContext'
import styles from './ProductCard.module.css'

export const ProductCard = ({product, onAddToCart}) => {
    return (
        <div className={styles.productCardContainer}>
            <div className={ styles.cont }>
                <div className={ styles.productCard }>
                    <div className={ styles.productCard__image }>
                        <img src={product.image[0]} alt={product.name}/>
                    </div>
                    <div className={ styles.productCard__info }>
                        <h2 className={ styles.productCard__title }>{product.name}</h2>
                        <p className={ styles.productCard__description }>{product.desc}</p>
                        <div className={ styles.productCard__priceRow }>
                            <span className={ styles.productCard__price }>{"$ " + product.price}</span>
                            <button className={ styles.productCard__btn } onClick={() => onAddToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}