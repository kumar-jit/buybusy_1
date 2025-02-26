
import { BiSearch } from 'react-icons/bi'
import styles from './SearchElement.module.css'
import { useRef } from 'react'

export const Search = ({onValueChange,onSearch}) => {
    const inputRef = useRef(null)
    
    return (
        <div className={styles.searchContainer}>
            <input type='text' className={styles.searchInput} onKeyUp={(event) => onValueChange(event)} ref={inputRef}></input>
            <button title='Search' className={styles.searchButton} ><BiSearch size={20}></BiSearch></button>
        </div>
    )
}